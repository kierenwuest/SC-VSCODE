import * as vscode from 'vscode';
import { exec } from 'child_process';
import { authenticate } from './commands/authenticate';
import { queryOrg } from './commands/queryOrg';
import { showInfo, showError, outputChannel } from './outputs';
import { WatcherManager } from './fileWatcher';
import { newRecord } from './commands/newRecord';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { baseSettings } from './types';
import { readSettingsJson } from './manageSettingsJson';

const execAsync = promisify(exec);

export async function activate(context: vscode.ExtensionContext) {
    // Show the output channel on activation
    outputChannel.show(true);

    // Register commands
    const authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', () => authenticate());
    const queryOrgCommand = vscode.commands.registerCommand('sc-vsc-webdev.queryOrg', () => queryOrg());
    const newRecordCommand = vscode.commands.registerCommand('sc-vsc-webdev.newRecord', (uri: vscode.Uri) => newRecord(uri));

    context.subscriptions.push(authenticateCommand, queryOrgCommand, newRecordCommand);

    // Initialize settings.json if it doesn't exist or is blank
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        const settingsDir = path.join(workspaceFolder, '.vscode');
        const settingsPath = path.join(settingsDir, 'settings.json');
        const launchPath = path.join(settingsDir, 'launch.json');

        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }

        let settings;
        if (!fs.existsSync(settingsPath) || fs.readFileSync(settingsPath, 'utf8').trim() === '') {
            const orgAlias = path.basename(workspaceFolder).replace(/\s+/g, '_');
            const orgStatus = await checkCliOrgStatus(orgAlias); // Capture the org status
            settings = baseSettings(orgAlias, workspaceFolder, orgStatus);
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            showInfo('Initialized settings.json with base structure.');
        } else {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        }

        // Check and create launch.json if missing
        if (!fs.existsSync(launchPath)) {
            const launchJsonContent = {
                "version": "0.2.0",
                "configurations": [
                    {
                        "name": "Launch Program",
                        "type": "node",
                        "request": "launch",
                        "program": "${workspaceFolder}/app.js",
                        "cwd": "${workspaceFolder}",
                        "console": "integratedTerminal"
                    }
                ]
            };
            fs.writeFileSync(launchPath, JSON.stringify(launchJsonContent, null, 4));
            showInfo('launch.json created with default configuration.');
        }

        // Attach watchers for new mappings
        setupWatchers(context);

        // Perform the steps in sequence using promises
        checkAndUpdateSfCli()
            .then(() => {
                const orgAlias = vscode.workspace.getConfiguration('SCWDSettings').get<string>('orgAlias');
                if (!orgAlias) {
                    throw new Error('Salesforce Org Alias is not configured.');
                }
                return checkCliOrgStatus(orgAlias);
            })
            .then(() => {
                showInfo("Org status checked.");
                showInfo("SCWD Ready");
            })
            .catch((error) => {
                showError(`Error during activation: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
            });
    } else {
        showError("No workspace folder is open. Please open a project folder and try again.");
    }
}

async function setupWatchers(context: vscode.ExtensionContext) {
    const fileMappings = await readSettingsJson();
    const orgAlias = vscode.workspace.getConfiguration('SCWDSettings').get<string>('orgAlias');

    showInfo(`Setting up new watchers for orgAlias: ${orgAlias}`);
    //showInfo(`New mappings: ${JSON.stringify(fileMappings, null, 2)}`);

    if (orgAlias && fileMappings.length > 0) {
        fileMappings.forEach(mapping => {
            showInfo(`Attaching watcher for path: ${mapping.localPath}`);
            WatcherManager.attach({
                localPath: mapping.localPath,
                salesforceObject: mapping.salesforceObject,
                salesforceField: mapping.salesforceField,
                salesforceRecordId: mapping.salesforceRecordId
            }, orgAlias);
        });
    } else {
        showError('No file mappings found to attach watchers.');
    }
}

async function checkCliOrgStatus(orgAlias: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        showError("No workspace folder is open. Please open a project folder and try again.");
        return 'Unknown';
    }

    const workspaceFolder = workspaceFolders[0].uri.fsPath;
    const settingsPath = path.join(workspaceFolder, '.vscode', 'settings.json');

    try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

        // Check Salesforce CLI status
        const command = `sf org display -o ${orgAlias} --json`;
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            showError(`Error checking Salesforce CLI status: ${stderr}`);
            return 'Unknown';
        }

        const result = JSON.parse(stdout);
        const status = result.result.connectedStatus || 'Unknown';
        settings['cliOrgStatus'] = status;

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        return status;
    } catch (error) {
        showError(`Failed to read settings.json: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
        return 'Unknown';
    }
}

async function checkAndUpdateSfCli() {
    try {
        const { stdout, stderr } = await execAsync('sf update stable');

        if (stderr) {
            showError(`Salesforce CLI update: ${stderr}`);
            return;
        }

        if (stdout.includes('already on version')) {
            showInfo('Salesforce CLI is already on the latest version.');
        } else if (stdout.includes('done')) {
            showInfo('Salesforce CLI has been updated to the latest version.');
        } else {
            showInfo('Salesforce CLI update status is unknown.');
        }
    } catch (error) {
        showError(`Error checking or updating Salesforce CLI: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
    }
}

export { checkAndUpdateSfCli };
