import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { log, showError, showInfo } from './outputs';
import { FileDetails } from './types';
import Queue from 'p-queue';

const updateQueue = new Queue({ concurrency: 1 });

export async function updateSettingsJson(localPath: string, detail: FileDetails, subDirectory: string, recordId: string) {
    await updateQueue.add(async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            showError("No workspace folder is open. Please open a project folder and try again.");
            return;
        }
        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        const settingsPath = path.join(workspaceFolder, '.vscode', 'settings.json');
        try {
            let settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            // Make sure to dynamically access properties to avoid TypeScript errors
            settings = settings || {};
            settings[detail.directory] = settings[detail.directory] || {};
            settings[detail.directory][detail.subDirectory] = settings[detail.directory][detail.subDirectory] || {};
            settings[detail.directory][detail.subDirectory][subDirectory] = settings[detail.directory][detail.subDirectory][subDirectory] || {};
            settings[detail.directory][detail.subDirectory][subDirectory][path.basename(localPath)] = {
                localPath,
                salesforceObject: detail.objectType,
                salesforceField: detail.field,
                salesforceRecordId: recordId
            };
            await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
            log(`Updated settings.json with new file: ${localPath}`);
        } catch (error) {
            showError(`Failed to update settings.json: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
    });
}

export async function readSettingsJson(): Promise<any[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        showError("No workspace folder is open. Please open a project folder and try again.");
        return [];
    }
    const workspaceFolder = workspaceFolders[0].uri.fsPath;
    const settingsPath = path.join(workspaceFolder, '.vscode', 'settings.json');
    try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

        // Traverse the structure and collect all file mappings
        const collectFileMappings = (obj: any, parentKeys: string[] = []) => {
            let fileMappings: any[] = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key].localPath) {
                        fileMappings.push({
                            ...obj[key],
                            parentKeys: parentKeys.join(' > ') // Or any other way you want to track the hierarchy
                        });
                    } else if (typeof obj[key] === 'object') {
                        fileMappings = fileMappings.concat(collectFileMappings(obj[key], parentKeys.concat(key)));
                    }
                }
            }
            return fileMappings;
        };

        const fileMappings = collectFileMappings(settings);
        showInfo(`Successfully read settings.json with file mappings.`);
        return fileMappings;
    } catch (error) {
        showError(`Failed to read settings.json: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        return [];
    }
}
