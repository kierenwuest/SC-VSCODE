import * as vscode from 'vscode';
import { authenticate } from './commands/authenticate';
import { linkAndSync } from './commands/linkAndSync';

export function activate(context: vscode.ExtensionContext) {
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync);

    context.subscriptions.push(authenticateCommand, linkAndSyncCommand);
}

export function deactivate() {
    // Clean up if needed
}