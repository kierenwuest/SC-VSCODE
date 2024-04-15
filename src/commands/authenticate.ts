import * as vscode from 'vscode';
import { exec } from 'child_process';
import { log, showError, showInfo } from '../outputs';
import * as path from 'path';

export function authenticate() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        showError("No workspace folder is open. Please open a project folder and try again.");
        return;
    }

    const folderName = path.basename(workspaceFolders[0].uri.fsPath);
    const alias = folderName.replace(/\s+/g, '_');

    const command = `sfdx force:auth:web:login -a ${alias} -r https://login.salesforce.com`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            showError(`Authentication failed: ${error.message}`);
            return;
        }
        if (stderr && stderr.trim().length > 0) {
            showError(`Authentication process reported an issue: ${stderr}`);
            return;
        }
        if (stdout.includes("Successfully authorized")) {
            showInfo(`Authenticated successfully. Org alias set to "${alias}".`);
            const config = vscode.workspace.getConfiguration('storeConnect');
            config.update('orgAlias', alias, vscode.ConfigurationTarget.Workspace)  // Save the alias to the workspace settings
                .then(() => log('Org alias saved to workspace settings.'),
                      error => showError('Failed to save org alias to workspace settings: ' + error));
        } else {
            showError('Authentication was not successful. Please check the output for more information.');
        }
        log(`STDOUT: ${stdout}`);
        log(`STDERR: ${stderr}`);
    });
}