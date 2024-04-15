import * as vscode from 'vscode';
import { authenticate } from './commands/authenticate';
import { linkAndSync } from './commands/linkAndSync';
import { log, showInfo } from './outputs';

export function activate(context: vscode.ExtensionContext) {
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync);

    context.subscriptions.push(authenticateCommand, linkAndSyncCommand);
    showInfo("SCWD Ready");  // Inform user that extension is ready
}

export function deactivate() {
    showInfo("SCWD Goodbye"); // Optionally inform the user that the extension is unloading
}