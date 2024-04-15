import * as vscode from 'vscode';
import { exec } from 'child_process';
import { log, showError, showInfo } from '../outputs';

export function authenticate() {
    const command = 'sfdx force:auth:web:login -a vscodeOrg -r https://login.salesforce.com';
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
            showInfo('Authenticated successfully. Org alias set to "vscodeOrg".');
        } else {
            showError('Authentication was not successful. Please check the output for more information.');
        }
        log(`STDOUT: ${stdout}`);
        log(`STDERR: ${stderr}`);
    });
}