import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { createSalesforceRecord, querySalesforceRecord } from '../salesforceAPI';
import { showError, showSuccess } from '../outputs';
import { fileDetailsMapping, FileDetails } from '../types';

export const newRecord = vscode.commands.registerCommand('sc-vsc-webdev.newRecord', async (uri: vscode.Uri) => {
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
    const orgAlias = vscode.workspace.getConfiguration('storeConnect').get<string>('orgAlias');

    if (!orgAlias) {
        showError('Salesforce Org Alias is not configured.');
        return;
    }

    try {
        let parentId: string | null = null;
        if (fileDetails.objectType !== 's_c__Content_Block__c') {
            parentId = await getParentId(fileDetails, parentDirectory, orgAlias);
        }
        const record = createRecordPayload(fileDetails, fileName, fileContent, parentDirectory, parentId, grandparentDirectory);
        await createSalesforceRecord(fileDetails.objectType, record, orgAlias);
        showSuccess(`Record created for ${fileName}`);
    } catch (error: any) {
        if (error.response && error.response.data) {
            showError(`Failed to create record: ${JSON.stringify(error.response.data)}`);
        } else if (error instanceof Error) {
            showError(`Failed to create record: ${error.message}`);
        } else {
            showError('An unknown error occurred during record creation.');
        }
    }
});

async function getParentId(details: FileDetails, parentName: string, orgAlias: string): Promise<string> {
    let objectName: string;
    switch (details.objectType) {
        case 's_c__Article__c':
        case 's_c__Script_Block__c':
        case 's_c__Style_Block__c':
            objectName = 's_c__Store__c';
            break;
        case 's_c__Theme_Template__c':
            objectName = 's_c__Theme__c';
            break;
        default:
            throw new Error('Unsupported object type for parent ID query');
    }

    const query = `SELECT Id FROM ${objectName} WHERE Name = '${parentName}' LIMIT 1`;
    const records = await querySalesforceRecord(query, orgAlias);

    if (records.length === 0) {
        throw new Error(`No ${objectName} found with name ${parentName}`);
    }

    return records[0].Id;
}

function createRecordPayload(details: FileDetails, fileName: string, fileContent: string, parentDir: string, parentId: string | null, grandparentDir: string): any {
    const nameWithoutExtension = path.basename(fileName, path.extname(fileName));
    const pathWithoutExtension = nameWithoutExtension.toLowerCase().replace(/\s+/g, '-');

    switch (details.objectType) {
        case 's_c__Article__c':
            return {
                Name: fileName,
                s_c__Title__c: nameWithoutExtension,
                s_c__Path__c: pathWithoutExtension,
                s_c__Store_Id__c: parentId!,
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
                s_c__Store_Id__c: parentId!,
                s_c__Content__c: fileContent,
                s_c__Active__c: true,
                s_c__Global__c: true
            };
        case 's_c__Script_Block__c':
            return {
                Name: nameWithoutExtension,
                s_c__Store_Id__c: parentId!,
                s_c__Content__c: fileContent,
                s_c__Active__c: true,
                s_c__Global__c: true
            };
        case 's_c__Theme_Template__c':
            return {
                Name: nameWithoutExtension,
                s_c__Theme_Id__c: parentId!,
                s_c__Content__c: fileContent,
                s_c__Key__c: `${grandparentDir}/${parentDir}/${nameWithoutExtension}`
            };
        default:
            throw new Error('Unknown object type');
    }
}