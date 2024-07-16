import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';
import { Mapping, FileDetails } from '../types';
import Queue from 'p-queue';
import { WatcherManager } from '../attachSaveListener'; 

const updateQueue = new Queue({ concurrency: 1 });

const fileDetailsMapping: FileDetails[] = [
    { objectType: 's_c__Content_Block__c', field: 's_c__Content_Markdown__c', extension: 'liquid', nameField: 's_c__Identifier__c', directory: 'Content_Blocks', subDirectory: 's_c__Template__c' },
    { objectType: 's_c__Theme_Template__c', field: 's_c__Content__c', extension: 'liquid', nameField: 's_c__Key__c', directory: 'Theme_Templates', subDirectory: 's_c__Theme_Id__r.Name' },
    { objectType: 's_c__Style_Block__c', field: 's_c__Content__c', extension: 'css', nameField: 'Name', directory: 'Style_Blocks', subDirectory: 's_c__Store_Id__r.Name' },
    { objectType: 's_c__Article__c', field: 's_c__Body_Markdown__c', extension: 'md', nameField: 's_c__Slug__c', directory: 'Articles', subDirectory: 's_c__Store_Id__r.Name' },
    { objectType: 's_c__Script_Block__c', field: 's_c__Content__c', extension: 'js', nameField: 'Name', directory: 'Script_Blocks', subDirectory: 's_c__Store_Id__r.Name' }
];

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
        // Directly fetch the sub-directory from the nested relationship
        const subDirectoryField = detail.subDirectory.split('.'); // e.g., ['s_c__Store_Id__r', 'Name']
        const subDirectory = record[subDirectoryField[0]][subDirectoryField[1]];

        // Log the sub-directory path to verify it's being captured correctly
        log(`Processing ${detail.objectType} - Sub-directory: ${subDirectory}`);

        // Construct the full directory path
        const directoryPath = path.join(vscode.workspace.rootPath || '', detail.directory, subDirectory.replace(/\//g, path.sep));  // Ensures cross-platform compatibility

        // Ensure the full directory path exists
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(directoryPath));

        // Prepare the file path from the record's name field and append the file extension.
        const fullPath = path.join(directoryPath, record[detail.nameField]);
        const fullFilePath = `${fullPath}.${detail.extension}`;

        try {
            // Write content to the file system
            await vscode.workspace.fs.writeFile(vscode.Uri.file(fullFilePath), Buffer.from(record[detail.field]));
            showInfo(`File created: ${fullFilePath}`);

            // Update settings JSON and initialize watcher
            await updateSettingsJson(fullFilePath, detail.objectType, detail.field, record.Id);
            WatcherManager.initializeIgnore(fullFilePath);
            WatcherManager.attach({ localPath: fullFilePath, salesforceObject: detail.objectType, salesforceField: detail.field, salesforceRecordId: record.Id }, orgAlias);
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