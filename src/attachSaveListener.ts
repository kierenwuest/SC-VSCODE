import * as vscode from 'vscode';
import { log, showError } from './outputs';
import { Mapping } from './types';
import { updateSalesforceRecord } from './updateSalesforceRecord'; 

class WatcherManager {
    private static activeWatchers = new Map<string, vscode.Disposable>();

    public static attach(mapping: Mapping, orgAlias: string) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
        if (!workspaceFolder) {
            showError("Workspace folder not found for the given file path.");
            return;
        }

        // Ensure not to add duplicate watchers
        if (this.activeWatchers.has(mapping.localPath)) {
            this.activeWatchers.get(mapping.localPath)?.dispose();
            this.activeWatchers.delete(mapping.localPath);
        }

        const pattern = new vscode.RelativePattern(workspaceFolder, vscode.workspace.asRelativePath(mapping.localPath));
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);

        const handleFileChange = (uri: vscode.Uri) => {
            if (uri.fsPath === mapping.localPath) {
                log(`File Changed: ${uri.fsPath}`);
                updateSalesforceRecord(mapping, uri, orgAlias);
            } else {
                log(`Ignored File Change: ${uri.fsPath}`);
            }
        };

        watcher.onDidChange(handleFileChange);
        watcher.onDidCreate(handleFileChange);
        watcher.onDidDelete(uri => {
            if (uri.fsPath === mapping.localPath) {
                log(`File Deleted: ${uri.fsPath}`);
                this.dispose(mapping.localPath);
            }
        });

        this.activeWatchers.set(mapping.localPath, watcher);
    }

    private static dispose(path: string) {
        if (this.activeWatchers.has(path)) {
            this.activeWatchers.get(path)?.dispose();
            this.activeWatchers.delete(path);
        }
    }
}

export { WatcherManager };
