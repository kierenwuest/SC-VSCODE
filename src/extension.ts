import * as vscode from 'vscode';
import { authenticate } from './commands/authenticate';
import { linkAndSync, attachSaveListener } from './commands/linkAndSync'; // Import attachSaveListener here
import { log, showInfo } from './outputs';

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync);
    context.subscriptions.push(authenticateCommand, linkAndSyncCommand);

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
            attachSaveListener(mapping, orgAlias);
            context.subscriptions.push({
                dispose: () => attachSaveListener(mapping, orgAlias)
            });
        });
    }
}

export function deactivate() {
    showInfo("SCWD Goodbye"); // Optionally inform the user that the extension is unloading
}