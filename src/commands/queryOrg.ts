import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';
import { Mapping, FileDetails } from '../types';
import Queue from 'p-queue';
import { WatcherManager } from '../attachSaveListener'; 

const updateQueue = new Queue({ concurrency: 1 });

const fileDetailsMapping: FileDetails[] = [
    { objectType: 's_c__Content_Block__c', field: 's_c__Content_Markdown__c', extension: 'liquid', nameField: 's_c__Identifier__c' },
    { objectType: 's_c__Theme_Template__c', field: 's_c__Content__c', extension: 'liquid', nameField: 's_c__Key__c' },
    { objectType: 's_c__Style_Block__c', field: 's_c__Content__c', extension: 'css', nameField: 'Name' },
    { objectType: 's_c__Article__c', field: 's_c__Body_Markdown__c', extension: 'md', nameField: 's_c__Slug__c' }
];

export async function queryOrg() {
    const orgAlias = vscode.workspace.getConfiguration('storeConnect').get<string>('orgAlias');
    if (!orgAlias) {
        showError('No Salesforce organization alias is configured.');
        return;
    }

    for (const detail of fileDetailsMapping) {
        const query = `sfdx force:data:soql:query -q "SELECT Id, ${detail.nameField}, ${detail.field} FROM ${detail.objectType}" -o ${orgAlias} --json`;
        exec(query, (error, stdout, stderr) => {
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
                if (data.result.records && data.result.records.length > 0) {
                    handleRecords(data.result.records, detail, orgAlias);
                } else {
                    log(`No records found for ${detail.objectType}.`);
                }
            } catch (error: unknown) {
              // Check if error is an instance of Error
              if (error instanceof Error) {
                  showError(`Error parsing query results: ${error.message}`);
              } else {
                  // If it's not an Error object, handle it as a generic error
                  showError(`An unexpected error occurred: ${String(error)}`);
              }
          }
        });
    }
}

async function handleRecords(records: any[], detail: FileDetails, orgAlias: string) {
    records.forEach(async (record) => {
        const fileName = record[detail.nameField].replace(/\//g, '|') + '.' + detail.extension;
        const content = record[detail.field];
        const filePath = path.join(vscode.workspace.rootPath || '', fileName);

        try {
            await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(content));
            showInfo(`File created: ${filePath}`);
            await updateSettingsJson(filePath, detail.objectType, detail.field, record.Id);
            WatcherManager.attach({
                localPath: filePath,
                salesforceObject: detail.objectType,
                salesforceField: detail.field,
                salesforceRecordId: record.Id
            }, orgAlias);
        } catch (err) {
            showError(`Failed to write file: ${err instanceof Error ? err.message : String(err)}`);
        }
    });
}

async function updateSettingsJson(localPath: string, objectType: string, field: string, recordId: string) {
  await updateQueue.add(async () => {
    const config = vscode.workspace.getConfiguration('storeConnect');
    let existingMappings = await config.get<Mapping[]>('fileMappings', []);
    console.log('Before Update:', existingMappings);

    const mappingExists = existingMappings.some(mapping => mapping.localPath === localPath);
    console.log('Does mapping exist:', mappingExists);

    if (!mappingExists) {
      const newMapping = { localPath, salesforceObject: objectType, salesforceField: field, salesforceRecordId: recordId };
      existingMappings.push(newMapping);
      console.log('After Adding new mapping:', existingMappings);

      try {
        await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
        console.log('Configuration successfully updated for', localPath);
      } catch (error) {
        console.error('Failed to update configuration:', error);
      }
    }
  });
}
