import * as vscode from 'vscode';
import { exec } from 'child_process';
import { log, showError, showInfo } from '../outputs';
import * as fs from 'fs';
import * as path from 'path';
import { baseSettings } from '../types';

export async function authenticate() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        showError("No workspace folder is open. Please open a project folder and try again.");
        return;
    }

    const folderName = path.basename(workspaceFolders[0].uri.fsPath);
    const alias = folderName.replace(/\s+/g, '_');

    const orgAlias = vscode.workspace.getConfiguration('SCWDSettings').get<string>('orgAlias') || alias;

    const command = `sfdx force:auth:web:login -a ${orgAlias}`;
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
            showInfo(`Authenticated successfully. Org alias set to "${orgAlias}".`);
            const config = vscode.workspace.getConfiguration('SCWDSettings');
            config.update('orgAlias', orgAlias, vscode.ConfigurationTarget.Workspace)
                .then(() => log('Org alias saved to workspace settings.'),
                    error => showError('Failed to save org alias to workspace settings: ' + error));

            // Initialize settings.json
            const settingsPath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', 'settings.json');
            const settings = baseSettings(orgAlias, workspaceFolders[0].uri.fsPath, "Connected");

            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            showInfo(`Settings initialized for org alias: ${orgAlias}`);
        } else {
            showError('Authentication was not successful. Please check the output for more information.');
        }
        log(`STDOUT: ${stdout}`);
        log(`STDERR: ${stderr}`);
    });
}
