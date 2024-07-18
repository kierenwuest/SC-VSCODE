import * as vscode from 'vscode';
import { exec } from 'child_process';
import { authenticate } from './commands/authenticate';
import { queryOrg } from './commands/queryOrg';
import { showInfo, showError } from './outputs';
import { WatcherManager } from './attachSaveListener';
import { newRecord } from './commands/newRecord';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { baseSettings } from './types';

const execAsync = promisify(exec);

export async function activate(context: vscode.ExtensionContext) {
    // Register commands
    const authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', () => authenticate());
    const queryOrgCommand = vscode.commands.registerCommand('sc-vsc-webdev.queryOrg', () => queryOrg());
    const newRecordCommand = vscode.commands.registerCommand('sc-vsc-webdev.newRecord', (uri: vscode.Uri) => newRecord(uri));
    const activateSCWDCommand = vscode.commands.registerCommand('sc-vsc-webdev.extension', () => toggleActivation(context));

    context.subscriptions.push(authenticateCommand, queryOrgCommand, newRecordCommand, activateSCWDCommand);

    // Initialize settings.json if it doesn't exist or is blank
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        const settingsDir = path.join(workspaceFolder, '.vscode');
        const settingsPath = path.join(settingsDir, 'settings.json');

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
    }

    // Perform the steps in sequence using promises
    checkAndUpdateSfCli()
        .then(() => {
            showInfo("Checked Salesforce CLI version.");
            const orgAlias = vscode.workspace.getConfiguration('storeConnect').get<string>('orgAlias');
            if (!orgAlias) {
                throw new Error('Salesforce Org Alias is not configured.');
            }
            return checkCliOrgStatus(orgAlias);
        })
        .then(() => {
            showInfo("Org statuses checked.");
            setupExistingWatchers(context);
            showInfo("Activated existing watchers.");
            showInfo("SCWD Ready");
        })
        .catch((error) => {
            showError(`Error during activation: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
        });
}

export function deactivate() {
    deactivateWatchers();
}

async function toggleActivation(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        showError("No workspace folder is open. Please open a project folder and try again.");
        return;
    }

    const workspaceFolder = workspaceFolders[0].uri.fsPath;
    const settingsPath = path.join(workspaceFolder, '.vscode', 'settings.json');

    try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

        if (settings['watchersActive']) {
            deactivate();
            settings['watchersActive'] = false;
            showInfo("SCWD deactivated.");
        } else {
            activate(context);
            settings['watchersActive'] = true;
            showInfo("SCWD activated.");
        }

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        showError(`Failed to read settings.json: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
    }
}

function setupExistingWatchers(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const existingMappings = config.get<any[]>('fileMappings', []);
    const orgAlias = config.get<string>('orgAlias');

    if (orgAlias && existingMappings) {
        existingMappings.forEach(mapping => {
            WatcherManager.attach(mapping, orgAlias);
        });
    }
}

function deactivateWatchers() {
    WatcherManager.removeAllWatchers();
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
        const command = `sf org display -u ${orgAlias} --json`;
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            showError(`Error checking Salesforce CLI status: ${stderr}`);
            return 'Unknown';
        }

        const result = JSON.parse(stdout);
        const status = result.result.Status || 'Unknown';
        settings['cliOrgStatus'] = status;

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        return status;
    } catch (error) {
        showError(`Failed to read settings.json: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
        return 'Unknown';
    }
}

async function checkAndUpdateSfCli() {
    const checkCommand = 'sf update:cli:status --json';

    try {
        const { stdout, stderr } = await execAsync(checkCommand);

        if (stderr) {
            showError(`Error checking Salesforce CLI update status: ${stderr}`);
            return;
        }

        const status = JSON.parse(stdout);

        if (status.needsUpdate) {
            showInfo('Salesforce CLI update is required. Updating now...');
            const updateCommand = 'sf update';
            await execAsync(updateCommand);
            showInfo('Salesforce CLI has been updated successfully.');
        } else {
            showInfo('Salesforce CLI is up-to-date.');
        }
    } catch (error) {
        showError(`Error checking or updating Salesforce CLI: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
    }
}

export { checkAndUpdateSfCli };
