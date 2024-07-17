import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getActiveOrg, createSalesforceRecord } from '../salesforceAPI';
import { showError, showSuccess } from '../outputs';
import { FileDetails } from '../types';

const fileDetailsMapping: FileDetails[] = [
    { objectType: 's_c__Article__c', directory: 'Articles', subDirectory: 's_c__Store_Id__r.Name', nameField: 's_c__Slug__c', extension: 'md', field: 's_c__Body_Markdown__c' },
    { objectType: 's_c__Content_Block__c', directory: 'Content_Blocks', subDirectory: 's_c__Template__c', nameField: 's_c__Identifier__c', extension: 'liquid', field: 's_c__Content_Markdown__c' },
    { objectType: 's_c__Script_Block__c', directory: 'Script_Blocks', subDirectory: 's_c__Store_Id__r.Name', nameField: 'Name', extension: 'js', field: 's_c__Content__c' },
    { objectType: 's_c__Style_Block__c', directory: 'Style_Blocks', subDirectory: 's_c__Store_Id__r.Name', nameField: 'Name', extension: 'css', field: 's_c__Content__c' },
    { objectType: 's_c__Theme_Template__c', directory: 'Theme_Templates', subDirectory: 's_c__Theme_Id__r.Name', nameField: 's_c__Key__c', extension: 'liquid', field: 's_c__Content__c' }
];

export const newRecord = vscode.commands.registerCommand('extension.newRecord', async (uri: vscode.Uri) => {
    const filePath = uri.fsPath;
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(fileName).substring(1);
    const fileDirectory = path.dirname(filePath);
    const parentDirectory = path.basename(fileDirectory);
    const grandparentDirectory = path.basename(path.dirname(fileDirectory));

    let fileDetails: FileDetails | undefined;
    for (const detail of fileDetailsMapping) {
        if (filePath.includes(detail.directory) && fileExtension === detail.extension) {
            fileDetails = detail;
            break;
        }
    }

    if (!fileDetails) {
        showError('Invalid file type or location.');
        return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const record = createRecordPayload(fileDetails, fileName, fileContent, parentDirectory, grandparentDirectory);

    try {
        const org = await getActiveOrg();
        await createSalesforceRecord(org, fileDetails.objectType, record);
        showSuccess(`Record created for ${fileName}`);
    } catch (error) {
        showError(`Failed to create record: ${error.message}`);
    }
});

function createRecordPayload(details: FileDetails, fileName: string, fileContent: string, parentDir: string, grandparentDir: string): any {
    const nameWithoutExtension = path.basename(fileName, path.extname(fileName));
    const pathWithoutExtension = nameWithoutExtension.toLowerCase().replace(/\s+/g, '-');

    switch (details.objectType) {
        case 's_c__Article__c':
            return {
                Name: fileName,
                s_c__Title__c: nameWithoutExtension,
                s_c__Path__c: pathWithoutExtension,
                s_c__Store_Id__c: parentDir, // Assuming store name maps directly to ID, adjust as necessary
                s_c__Body_Markdown__c: fileContent
            };
        case 's_c__Content_Block__c':
            return {
                Name: nameWithoutExtension,
                s_c__Template__c: parentDir,
                s_c__Content_Markdown__c: fileContent
            };
        case 's_c__Style_Block__c':
            return {
                Name: nameWithoutExtension,
                s_c__Store_Id__c: parentDir,
                s_c__Content__c: fileContent,
                s_c__Active__c: true,
                s_c__Global__c: true
            };
        case 's_c__Script_Block__c':
            return {
                Name: nameWithoutExtension,
                s_c__Store_Id__c: parentDir,
                s_c__Content__c: fileContent,
                s_c__Active__c: true,
                s_c__Global__c: true
            };
        case 's_c__Theme_Template__c':
            return {
                Name: nameWithoutExtension,
                s_c__Theme_Id__c: parentDir,
                s_c__Content__c: fileContent,
                s_c__Key__c: `${grandparentDir}/${parentDir}/${nameWithoutExtension}`
            };
        default:
            throw new Error('Unknown object type');
    }
}
