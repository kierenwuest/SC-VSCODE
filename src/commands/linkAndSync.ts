import * as vscode from 'vscode';
import { exec } from 'child_process';

export async function linkAndSync() {
    const input = await vscode.window.showInputBox({ prompt: 'Enter configuration as [Object].[Field]:[RecordID]' });
    if (!input) {
        vscode.window.showErrorMessage("Input was cancelled or empty.");
        return;
    }

    const pattern = /^(.+)\.(.+):(.+)$/;
    const match = input.match(pattern);

    if (!match) {
        vscode.window.showErrorMessage("Input format is incorrect. Please use the format [Object].[Field]:[RecordID]");
        return;
    }

    const [_, salesforceObject, salesforceField, salesforceRecordId] = match;

    if (salesforceObject && salesforceField && salesforceRecordId) {
        const config = vscode.workspace.getConfiguration('storeConnect');
        let existingMappings = config.get('fileMappings', []) as Array<{ salesforceObject: string, salesforceField: string, salesforceRecordId: string }>;
        const newMapping = { salesforceObject, salesforceField, salesforceRecordId };
        existingMappings.push(newMapping);
        await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage("Salesforce link and sync configuration saved.");
        
        attachSaveListener(newMapping);
    } else {
        vscode.window.showErrorMessage("All components must be provided in the format [Object].[Field]:[RecordID].");
    }
}

function attachSaveListener(mapping: { salesforceObject: string; salesforceField: string; salesforceRecordId: string }) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.getWorkspaceFolder(activeEditor.document.uri)!, activeEditor.document.fileName));
        watcher.onDidChange(uri => {
            updateSalesforceRecord(mapping, uri);
        });
    }
}

function updateSalesforceRecord(mapping: { salesforceObject: string; salesforceField: string; salesforceRecordId: string }, uri: vscode.Uri) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        let content = doc.getText();
        const updateCommand = `sfdx force:data:record:update -s ${mapping.salesforceObject} -i ${mapping.salesforceRecordId} -v "${mapping.salesforceField}='${content.replace(/'/g, "\\'")}'" --json`;

        exec(updateCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Update error: ${error}`);
                vscode.window.showErrorMessage(`Failed to update Salesforce record: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error updating Salesforce: ${stderr}`);
                vscode.window.showErrorMessage(`Error during Salesforce update: ${stderr}`);
                return;
            }
            try {
                const response = JSON.parse(stdout);
                if (response.status === 0) {
                    vscode.window.showInformationMessage('Salesforce record updated successfully.');
                } else {
                    vscode.window.showErrorMessage(`Failed to update Salesforce record: ${response.message}`);
                }
            } catch (parseError) {
                console.error(`Error parsing Salesforce response: ${parseError}`);
                vscode.window.showErrorMessage('Error parsing Salesforce response.');
            }
        });
    });
}