import * as vscode from 'vscode';

export async function linkAndSync() {
    const objectName = await vscode.window.showInputBox({ prompt: 'Enter Salesforce Object API Name' });
    const fieldName = await vscode.window.showInputBox({ prompt: 'Enter Salesforce Field API Name' });
    const recordId = await vscode.window.showInputBox({ prompt: 'Enter Salesforce Record ID' });

    const config = vscode.workspace.getConfiguration('storeConnect');
    const newMapping = { objectName, fieldName, recordId };
    let existingMappings = config.get('fileMappings', []);
    existingMappings.push(newMapping);
    await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
}

