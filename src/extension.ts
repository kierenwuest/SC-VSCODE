import * as vscode from 'vscode';
import { authenticate } from './commands/authenticate';
import { linkAndSync } from './commands/linkAndSync';
import { queryOrg } from './commands/queryOrg';
import { showInfo } from './outputs';
import { WatcherManager } from './attachSaveListener';
import { newRecord } from './commands/newRecord';

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync);
    let queryOrgCommand = vscode.commands.registerCommand('sc-vsc-webdev.queryOrg', queryOrg);

    context.subscriptions.push(authenticateCommand, linkAndSyncCommand, queryOrgCommand);

    // Set up existing file watchers
    setupExistingWatchers(context);

    // Inform user that extension is ready
    showInfo("SCWD Ready");
}

function setupExistingWatchers(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const existingMappings = config.get('fileMappings', []);
    const orgAlias = config.get<string>('orgAlias');

    if (orgAlias && existingMappings) {
        existingMappings.forEach(mapping => {
            WatcherManager.attach(mapping, orgAlias); // Use WatcherManager to attach watchers
            // Subscriptions to dispose watchers aren't needed because the manager handles it
        });
    }
}

export function deactivate() {
    showInfo("SCWD Goodbye"); // Optionally inform the user that the extension is unloading
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(newRecord);
}