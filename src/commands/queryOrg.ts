import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';
import { Mapping, fileDetailsMapping, FileDetails  } from '../types';
import Queue from 'p-queue';
import { WatcherManager } from '../attachSaveListener'; 

const updateQueue = new Queue({ concurrency: 1 });

export async function queryOrg() {
    const orgAlias = vscode.workspace.getConfiguration('storeConnect').get<string>('orgAlias');
    if (!orgAlias) {
        showError('No Salesforce organization alias is configured.');
        return;
    }

    for (const detail of fileDetailsMapping) {
        const query = `sfdx force:data:soql:query -q "SELECT Id, ${detail.nameField}, ${detail.field}, ${detail.subDirectory} FROM ${detail.objectType}" -o ${orgAlias} --json`;

        exec(query, async (error, stdout, stderr) => {
            if (error) {
                showError(`Error querying Salesforce: ${error.message}`);
                return;
            }
            if (stderr) {
                showError(`SOQL Error: ${stderr}`);
                return;
            }
            try {
                const data = JSON.parse(stdout);
                log(`Query Data: ${JSON.stringify(data, null, 2)}`); // This will log the full structure of the response
                if (data.result.records && data.result.records.length > 0) {
                    await handleRecords(data.result.records, detail, orgAlias);
                } else {
                    log(`No records found for ${detail.objectType}.`);
                }
            } catch (error) {
                showError(`Error parsing query results: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
            }
        });
    }
}

async function handleRecords(records: any[], detail: FileDetails, orgAlias: string) {
    for (const record of records) {
        let subDirectory;
        if (detail.subDirectory.includes('.')) {
            // Handling nested relationship fields
            const subDirectoryField = detail.subDirectory.split('.'); // e.g., ['s_c__Store_Id__r', 'Name']
            subDirectory = record[subDirectoryField[0]] ? record[subDirectoryField[0]][subDirectoryField[1]] : 'Default';
        } else {
            // Handling direct fields
            subDirectory = record[detail.subDirectory] || 'Default';
        }

        log(`Processing ${detail.objectType} - Sub-directory: ${subDirectory}`);

        const directoryPath = path.join(vscode.workspace.rootPath || '', detail.directory, subDirectory.replace(/\//g, path.sep));
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(directoryPath));

        const fullPath = path.join(directoryPath, `${record[detail.nameField]}.${detail.extension}`);
        
        try {
            await vscode.workspace.fs.writeFile(vscode.Uri.file(fullPath), Buffer.from(record[detail.field]));
            showInfo(`File created: ${fullPath}`);

            await updateSettingsJson(fullPath, detail.objectType, detail.field, record.Id);
            WatcherManager.initializeIgnore(fullPath);
            WatcherManager.attach({ localPath: fullPath, salesforceObject: detail.objectType, salesforceField: detail.field, salesforceRecordId: record.Id }, orgAlias);
        } catch (err) {
            showError(`Failed to write file: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}

async function updateSettingsJson(localPath: string, objectType: string, field: string, recordId: string) {
    await updateQueue.add(async () => {
        const config = vscode.workspace.getConfiguration('storeConnect');
        let existingMappings = await config.get<Mapping[]>('fileMappings', []);
        const mappingExists = existingMappings.some(mapping => mapping.localPath === localPath);
        if (!mappingExists) {
            const newMapping = { localPath, salesforceObject: objectType, salesforceField: field, salesforceRecordId: recordId };
            existingMappings.push(newMapping);
            try {
                await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
            } catch (error) {
                console.error('Failed to update configuration:', error);
            }
        }
    });
}