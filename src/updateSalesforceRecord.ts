import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { showError, showInfo } from './outputs';
import { Mapping } from './types';

export function updateSalesforceRecord(mapping: Mapping, uri: vscode.Uri, orgAlias: string) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        const content = doc.getText();
        const escapedContent = escapeContent(content);
        const fieldValue = `${mapping.salesforceField}='${escapedContent}'`;
        const updateCommand = `sfdx force:data:record:update -s ${mapping.salesforceObject} -i ${mapping.salesforceRecordId} -v "${fieldValue}" -u ${orgAlias} --json`;

        const proc = spawn('bash', ['-c', updateCommand]);

        proc.stdout.on('data', (data: Buffer) => {
            try {
                const response = JSON.parse(data.toString());
                if (response.status === 0) {
                    showInfo('Salesforce record updated successfully.');
                } else {
                    showError(`Failed to update record: ${response.message}`);
                }
            } catch (error) {
                showError(`Error parsing Salesforce response: ${error instanceof Error ? error.message : 'unknown error'}`);
            }
        });

        proc.stderr.on('data', (data: Buffer) => {
            showError(`Error during Salesforce update: ${data.toString()}`);
        });

        proc.on('error', (error: Error) => {
            showError(`Update error: ${error.message}`);
        });
    });
}

function escapeContent(content: string): string {
    return content.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
