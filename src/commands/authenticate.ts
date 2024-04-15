import * as vscode from 'vscode';
import { exec } from 'child_process';

export function authenticate() {
    // Command to authenticate using Salesforce CLI
    const command = 'sfdx force:auth:web:login -a vscodeOrg -r https://login.salesforce.com';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            vscode.window.showErrorMessage('Authentication failed. Please ensure Salesforce CLI is installed.');
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            vscode.window.showErrorMessage('Error during authentication. Check the terminal for more information.');
            return;
        }
        vscode.window.showInformationMessage('Authenticated successfully. Org alias set to "vscodeOrg".');
        console.log(stdout);  // Output the result of the CLI command
    });
}