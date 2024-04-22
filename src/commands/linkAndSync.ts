import * as vscode from 'vscode';
import { exec, ExecException , spawn } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';

interface Mapping {
    localPath: string;
    salesforceObject: string;
    salesforceField: string;
    salesforceRecordId: string;
}

export async function linkAndSync() {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const orgAlias = config.get<string>('orgAlias');
    if (!orgAlias) {
        showError('No Salesforce organization alias is configured.');
        return;
    }

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

        attachSaveListener(newMapping, orgAlias); // Correctly call attachSaveListener here
    } else {
        showError("All components must be provided in the format [Object].[Field]:[RecordID], and a file must be open.");
    }
}

let activeWatchers = new Map<string, vscode.Disposable>();

export function attachSaveListener(mapping: Mapping, orgAlias: string) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
    if (!workspaceFolder) {
        showError("Workspace folder not found for the given file path.");
        return;
    }

    const pattern = new vscode.RelativePattern(workspaceFolder, path.basename(mapping.localPath));
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    const handleFileChange = (uri: vscode.Uri) => {
        if (uri.fsPath === mapping.localPath) {
            log(`File Changed: ${uri.fsPath}`);
            updateSalesforceRecord(mapping, uri, orgAlias);
        } else {
            log(`Ignored File Change: ${uri.fsPath}`);
        }
    };

    watcher.onDidChange(handleFileChange);
    watcher.onDidCreate(handleFileChange);
    watcher.onDidDelete(uri => {
        if (uri.fsPath === mapping.localPath) {
            log(`File Deleted: ${uri.fsPath}`);
            activeWatchers.get(mapping.localPath)?.dispose();
            activeWatchers.delete(mapping.localPath);
        }
    });

    if (activeWatchers.has(mapping.localPath)) {
        activeWatchers.get(mapping.localPath)?.dispose();
    }
    activeWatchers.set(mapping.localPath, watcher);
}

function updateSalesforceRecord(mapping: Mapping, uri: vscode.Uri, orgAlias: string) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        const content = doc.getText();
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '\\"'); // Use a function to properly escape all necessary characters
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