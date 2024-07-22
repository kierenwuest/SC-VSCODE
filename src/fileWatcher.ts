import * as vscode from 'vscode';
import { showInfo, showError } from './outputs';
import { Mapping } from './types';
import { updateSalesforceRecord } from './salesforceAPI';
import * as path from 'path';
import { newRecord } from './commands/newRecord'; // Ensure correct import

class WatcherManager {
    private static activeWatchers = new Map<string, vscode.FileSystemWatcher>();
    private static ignoreInitialChange = new Set<string>(); // To ignore the initial change after creation

    public static attach(mapping: Mapping, orgAlias: string) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
        if (!workspaceFolder) {
            showError("Workspace folder not found for the given file path.");
            return;
        }

        // Ensure not to add duplicate watchers
        if (this.activeWatchers.has(mapping.localPath)) {
            this.disposeWatcher(mapping.localPath);
        }

        const pattern = new vscode.RelativePattern(workspaceFolder, vscode.workspace.asRelativePath(mapping.localPath));
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);
        
        const handleFileChange = (uri: vscode.Uri) => {
            if (this.ignoreInitialChange.has(uri.fsPath)) {
                this.ignoreInitialChange.delete(uri.fsPath);
                return;
            }

            if (uri.fsPath === mapping.localPath) {
                showInfo(`File Changed: ${uri.fsPath}`);
                updateSalesforceRecord(mapping, uri, orgAlias);
            } else {
                showInfo(`Ignored File Change: ${uri.fsPath}`);
            }
        };

        watcher.onDidChange(handleFileChange);
        watcher.onDidCreate((uri) => this.handleFileCreate(uri, orgAlias));

        showInfo(`Watcher attached to: ${mapping.localPath}`);
        this.activeWatchers.set(mapping.localPath, watcher);
        this.ignoreInitialChange.add(mapping.localPath); 
    }

    private static async handleFileCreate(uri: vscode.Uri, orgAlias: string) { // Removed mapping from parameters
        showInfo(`handleFileCreate triggered for: ${uri.fsPath}`);

        if (this.ignoreInitialChange.has(uri.fsPath)) {
            this.ignoreInitialChange.delete(uri.fsPath);
            showInfo(`Ignoring initial change for: ${uri.fsPath}`);
            return;
        }

        try {
            // Call newRecord with the URI of the new file
            await newRecord(uri);
            showInfo(`New record creation initiated for: ${uri.fsPath}`);
        } catch (err) {
            showError(`Failed to create new record for ${uri.fsPath}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    public static initializeIgnore(path: string) {
        this.ignoreInitialChange.add(path);
    }

    private static disposeWatcher(path: string) {
        if (this.activeWatchers.has(path)) {
            this.activeWatchers.get(path)?.dispose();
            this.activeWatchers.delete(path);
            this.ignoreInitialChange.delete(path); // Make sure to clean up the ignore set
        }
    }
}

export { WatcherManager };