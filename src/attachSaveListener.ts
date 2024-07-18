import * as vscode from 'vscode';
import { log, showError } from './outputs';
import { Mapping } from './types';
import { updateSalesforceRecord } from './salesforceAPI';
import { newRecord } from './commands/newRecord';

class WatcherManager {
    private static activeWatchers = new Map<string, vscode.Disposable>();
    private static ignoreInitialChange = new Set<string>(); // To ignore the initial change after creation

    public static attach(mapping: Mapping, orgAlias: string) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
        if (!workspaceFolder) {
            showError("Workspace folder not found for the given file path.");
            return;
        }

        // Ensure not to add duplicate watchers
        if (this.activeWatchers.has(mapping.localPath)) {
            this.dispose(mapping.localPath);
        }

        const pattern = new vscode.RelativePattern(workspaceFolder, vscode.workspace.asRelativePath(mapping.localPath));
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);

        const handleFileChange = (uri: vscode.Uri) => {
            if (this.ignoreInitialChange.has(uri.fsPath)) {
                this.ignoreInitialChange.delete(uri.fsPath);
                return;
            }

            if (uri.fsPath === mapping.localPath) {
                log(`File Changed: ${uri.fsPath}`);
                updateSalesforceRecord(mapping, uri, orgAlias);
            } else {
                log(`Ignored File Change: ${uri.fsPath}`);
            }
        };

        const handleFileCreate = async (uri: vscode.Uri) => {
            if (this.ignoreInitialChange.has(uri.fsPath)) {
                this.ignoreInitialChange.delete(uri.fsPath);
                return;
            }

            const config = vscode.workspace.getConfiguration('storeConnect');
            const fileMappings = config.get<any[]>('fileMappings', []);
            const existingMapping = fileMappings.find(mapping => mapping.localPath === uri.fsPath);

            if (!existingMapping) {
                log(`New file detected: ${uri.fsPath}`);
                await newRecord(uri); // Trigger newRecord command for new files
            }
        };

        watcher.onDidChange(handleFileChange);
        watcher.onDidCreate(handleFileCreate);
        watcher.onDidDelete(uri => {
            if (uri.fsPath === mapping.localPath) {
                log(`File Deleted: ${uri.fsPath}`);
                this.dispose(mapping.localPath);
            }
        });

        this.activeWatchers.set(mapping.localPath, watcher);
        this.ignoreInitialChange.add(mapping.localPath); // Ignore the next change after creation
    }

    public static initializeIgnore(path: string) {
        this.ignoreInitialChange.add(path);
    }

    public static removeAllWatchers() {
        this.activeWatchers.forEach((watcher, path) => {
            watcher.dispose();
            log(`Watcher disposed for: ${path}`);
        });
        this.activeWatchers.clear();
        this.ignoreInitialChange.clear();
    }

    private static dispose(path: string) {
        if (this.activeWatchers.has(path)) {
            this.activeWatchers.get(path)?.dispose();
            this.activeWatchers.delete(path);
            this.ignoreInitialChange.delete(path); // Make sure to clean up the ignore set
        }
    }
}

export { WatcherManager };
