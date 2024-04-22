import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
import { log, showError, showInfo } from '../outputs';
import { Mapping } from '../types';
import { WatcherManager } from '../attachSaveListener'; 

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

        // Check if mapping already exists to avoid duplicates
        if (!existingMappings.some(m => m.localPath === newMapping.localPath)) {
            existingMappings.push(newMapping);
            await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
            showInfo("Salesforce link and sync configuration saved.");

            // Attach file watcher through the WatcherManager
            WatcherManager.attach(newMapping, orgAlias);
        } else {
            showInfo("Configuration already exists for this file.");
        }
    } else {
        showError("All components must be provided in the format [Object].[Field]:[RecordID], and a file must be open.");
    }
}
