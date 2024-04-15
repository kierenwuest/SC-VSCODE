import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';

interface Mapping {
    localPath: string;
    salesforceObject: string;
    salesforceField: string;
    salesforceRecordId: string;
}

export async function linkAndSync() {
    const input = await vscode.window.showInputBox({ prompt: 'Enter configuration as [Object].[Field]:[RecordID]' });
    if (!input) {
        showError("Input was cancelled or empty.");
        return;
    }

    const pattern = /^(.+)\.(.+):(.+)$/;
    const match = input.match(pattern);

    if (!match) {
        showError("Input format is incorrect. Please use the format [Object].[Field]:[RecordID]");
        return;
    }

    const [_, salesforceObject, salesforceField, salesforceRecordId] = match;
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor && salesforceObject && salesforceField && salesforceRecordId) {
        const config = vscode.workspace.getConfiguration('storeConnect');
        let existingMappings = config.get<Mapping[]>('fileMappings', []);
        
        const newMapping: Mapping = {
            localPath: activeEditor.document.fileName,
            salesforceObject,
            salesforceField,
            salesforceRecordId
        };
        
        existingMappings.push(newMapping);
        await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
        showInfo("Salesforce link and sync configuration saved.");
        
        attachSaveListener(newMapping);
    } else {
        showError("All components must be provided in the format [Object].[Field]:[RecordID], and a file must be open.");
    }
}

let activeWatchers = new Map<string, vscode.Disposable>();

function attachSaveListener(mapping: Mapping) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
    if (!workspaceFolder) {
        showError("Workspace folder not found for the given file path.");
        return;
    }

    const pattern = new vscode.RelativePattern(workspaceFolder, '**/' + path.basename(mapping.localPath));
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidChange(uri => {
        log(`File Changed: ${uri.fsPath}`);
        updateSalesforceRecord(mapping, uri);
    });
    watcher.onDidCreate(uri => {
        log(`File Created: ${uri.fsPath}`);
        updateSalesforceRecord(mapping, uri);
    });
    watcher.onDidDelete(uri => {
        log(`File Deleted: ${uri.fsPath}`);
        activeWatchers.get(mapping.localPath)?.dispose(); 
        activeWatchers.delete(mapping.localPath);
    });

    if (activeWatchers.has(mapping.localPath)) {
        activeWatchers.get(mapping.localPath)?.dispose();
    }
    activeWatchers.set(mapping.localPath, watcher);
}

function updateSalesforceRecord(mapping: Mapping, uri: vscode.Uri) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        const content = doc.getText();
        const updateCommand = `sfdx force:data:record:update -s ${mapping.salesforceObject} -i ${mapping.salesforceRecordId} -v "${mapping.salesforceField}='${content.replace(/'/g, "\\'")}'" --json`;

        exec(updateCommand, (error, stdout, stderr) => {
            if (error) {
                showError(`Update error: ${error.message}`);
                return;
            }
            if (stderr) {
                showError(`Error during Salesforce update: ${stderr}`);
                return;
            }
            try {
                const response = JSON.parse(stdout);
                if (response.status === 0) {
                    showInfo('Salesforce record updated successfully.');
                } else {
                    showError(`Failed to update record: ${response.message}`);
                }
            } catch (e) {
                showError('Error parsing Salesforce response.');
            }
        });
    });
}