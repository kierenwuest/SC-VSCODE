/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const authenticate_1 = __webpack_require__(2);
const linkAndSync_1 = __webpack_require__(6);
const queryOrg_1 = __webpack_require__(9);
const outputs_1 = __webpack_require__(4);
const attachSaveListener_1 = __webpack_require__(7); // Correct import for WatcherManager
function activate(context) {
    // Register commands
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate_1.authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync_1.linkAndSync);
    let queryOrgCommand = vscode.commands.registerCommand('sc-vsc-webdev.queryOrg', queryOrg_1.queryOrg);
    context.subscriptions.push(authenticateCommand, linkAndSyncCommand, queryOrgCommand);
    // Set up existing file watchers
    setupExistingWatchers(context);
    // Inform user that extension is ready
    (0, outputs_1.showInfo)("SCWD Ready");
}
exports.activate = activate;
function setupExistingWatchers(context) {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const existingMappings = config.get('fileMappings', []);
    const orgAlias = config.get('orgAlias');
    if (orgAlias && existingMappings) {
        existingMappings.forEach(mapping => {
            attachSaveListener_1.WatcherManager.attach(mapping, orgAlias); // Use WatcherManager to attach watchers
            // Subscriptions to dispose watchers aren't needed because the manager handles it
        });
    }
}
function deactivate() {
    (0, outputs_1.showInfo)("SCWD Goodbye"); // Optionally inform the user that the extension is unloading
}
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authenticate = void 0;
const vscode = __importStar(__webpack_require__(1));
const child_process_1 = __webpack_require__(3);
const outputs_1 = __webpack_require__(4);
const path = __importStar(__webpack_require__(5));
function authenticate() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        (0, outputs_1.showError)("No workspace folder is open. Please open a project folder and try again.");
        return;
    }
    const folderName = path.basename(workspaceFolders[0].uri.fsPath);
    const alias = folderName.replace(/\s+/g, '_');
    const command = `sfdx force:auth:web:login -a ${alias} -r https://login.salesforce.com`;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        if (error) {
            (0, outputs_1.showError)(`Authentication failed: ${error.message}`);
            return;
        }
        if (stderr && stderr.trim().length > 0) {
            (0, outputs_1.showError)(`Authentication process reported an issue: ${stderr}`);
            return;
        }
        if (stdout.includes("Successfully authorized")) {
            (0, outputs_1.showInfo)(`Authenticated successfully. Org alias set to "${alias}".`);
            const config = vscode.workspace.getConfiguration('storeConnect');
            config.update('orgAlias', alias, vscode.ConfigurationTarget.Workspace) // Save the alias to the workspace settings
                .then(() => (0, outputs_1.log)('Org alias saved to workspace settings.'), error => (0, outputs_1.showError)('Failed to save org alias to workspace settings: ' + error));
        }
        else {
            (0, outputs_1.showError)('Authentication was not successful. Please check the output for more information.');
        }
        (0, outputs_1.log)(`STDOUT: ${stdout}`);
        (0, outputs_1.log)(`STDERR: ${stderr}`);
    });
}
exports.authenticate = authenticate;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showInfo = exports.showError = exports.clearOutput = exports.showOutput = exports.log = void 0;
// outputs.ts
const vscode = __importStar(__webpack_require__(1));
// Create a singleton output channel instance
const outputChannel = vscode.window.createOutputChannel("My Extension Logs");
function log(message) {
    outputChannel.appendLine(message);
}
exports.log = log;
function showOutput() {
    outputChannel.show(true);
}
exports.showOutput = showOutput;
function clearOutput() {
    outputChannel.clear();
}
exports.clearOutput = clearOutput;
function showError(message) {
    vscode.window.showErrorMessage(message);
    log(message); // Also log the error to the output channel
}
exports.showError = showError;
function showInfo(message) {
    vscode.window.showInformationMessage(message);
    log(message); // Also log the info to the output channel
}
exports.showInfo = showInfo;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.linkAndSync = void 0;
const vscode = __importStar(__webpack_require__(1));
const outputs_1 = __webpack_require__(4);
const attachSaveListener_1 = __webpack_require__(7);
async function linkAndSync() {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const orgAlias = config.get('orgAlias');
    if (!orgAlias) {
        (0, outputs_1.showError)('No Salesforce organization alias is configured.');
        return;
    }
    const input = await vscode.window.showInputBox({ prompt: 'Enter configuration as [Object].[Field]:[RecordID]' });
    if (!input) {
        (0, outputs_1.showError)("Input was cancelled or empty.");
        return;
    }
    const pattern = /^(.+)\.(.+):(.+)$/;
    const match = input.match(pattern);
    if (!match) {
        (0, outputs_1.showError)("Input format is incorrect. Please use the format [Object].[Field]:[RecordID]");
        return;
    }
    const [_, salesforceObject, salesforceField, salesforceRecordId] = match;
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && salesforceObject && salesforceField && salesforceRecordId) {
        let existingMappings = config.get('fileMappings', []);
        const newMapping = {
            localPath: activeEditor.document.fileName,
            salesforceObject,
            salesforceField,
            salesforceRecordId
        };
        // Check if mapping already exists to avoid duplicates
        if (!existingMappings.some(m => m.localPath === newMapping.localPath)) {
            existingMappings.push(newMapping);
            await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
            (0, outputs_1.showInfo)("Salesforce link and sync configuration saved.");
            // Attach file watcher through the WatcherManager
            attachSaveListener_1.WatcherManager.attach(newMapping, orgAlias);
        }
        else {
            (0, outputs_1.showInfo)("Configuration already exists for this file.");
        }
    }
    else {
        (0, outputs_1.showError)("All components must be provided in the format [Object].[Field]:[RecordID], and a file must be open.");
    }
}
exports.linkAndSync = linkAndSync;


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WatcherManager = void 0;
const vscode = __importStar(__webpack_require__(1));
const outputs_1 = __webpack_require__(4);
const updateSalesforceRecord_1 = __webpack_require__(8);
class WatcherManager {
    static activeWatchers = new Map();
    static ignoreInitialChange = new Set(); // To ignore the initial change after creation
    static attach(mapping, orgAlias) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
        if (!workspaceFolder) {
            (0, outputs_1.showError)("Workspace folder not found for the given file path.");
            return;
        }
        // Ensure not to add duplicate watchers
        if (this.activeWatchers.has(mapping.localPath)) {
            this.dispose(mapping.localPath);
        }
        const pattern = new vscode.RelativePattern(workspaceFolder, vscode.workspace.asRelativePath(mapping.localPath));
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);
        const handleFileChange = (uri) => {
            if (this.ignoreInitialChange.has(uri.fsPath)) {
                this.ignoreInitialChange.delete(uri.fsPath);
                return;
            }
            if (uri.fsPath === mapping.localPath) {
                (0, outputs_1.log)(`File Changed: ${uri.fsPath}`);
                (0, updateSalesforceRecord_1.updateSalesforceRecord)(mapping, uri, orgAlias);
            }
            else {
                (0, outputs_1.log)(`Ignored File Change: ${uri.fsPath}`);
            }
        };
        watcher.onDidChange(handleFileChange);
        watcher.onDidCreate(handleFileChange);
        watcher.onDidDelete(uri => {
            if (uri.fsPath === mapping.localPath) {
                (0, outputs_1.log)(`File Deleted: ${uri.fsPath}`);
                this.dispose(mapping.localPath);
            }
        });
        this.activeWatchers.set(mapping.localPath, watcher);
        this.ignoreInitialChange.add(mapping.localPath); // Ignore the next change after creation
    }
    static initializeIgnore(path) {
        this.ignoreInitialChange.add(path);
    }
    static dispose(path) {
        if (this.activeWatchers.has(path)) {
            this.activeWatchers.get(path)?.dispose();
            this.activeWatchers.delete(path);
            this.ignoreInitialChange.delete(path); // Make sure to clean up the ignore set
        }
    }
}
exports.WatcherManager = WatcherManager;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateSalesforceRecord = void 0;
const vscode = __importStar(__webpack_require__(1));
const child_process_1 = __webpack_require__(3);
const outputs_1 = __webpack_require__(4);
function updateSalesforceRecord(mapping, uri, orgAlias) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        const content = doc.getText();
        const escapedContent = escapeContent(content);
        const fieldValue = `${mapping.salesforceField}='${escapedContent}'`;
        const updateCommand = `sfdx force:data:record:update -s ${mapping.salesforceObject} -i ${mapping.salesforceRecordId} -v "${fieldValue}" -u ${orgAlias} --json`;
        const proc = (0, child_process_1.spawn)('bash', ['-c', updateCommand]);
        proc.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                if (response.status === 0) {
                    (0, outputs_1.showInfo)('Salesforce record updated successfully.');
                }
                else {
                    (0, outputs_1.showError)(`Failed to update record: ${response.message}`);
                }
            }
            catch (error) {
                (0, outputs_1.showError)(`Error parsing Salesforce response: ${error instanceof Error ? error.message : 'unknown error'}`);
            }
        });
        proc.stderr.on('data', (data) => {
            (0, outputs_1.showError)(`Error during Salesforce update: ${data.toString()}`);
        });
        proc.on('error', (error) => {
            (0, outputs_1.showError)(`Update error: ${error.message}`);
        });
    });
}
exports.updateSalesforceRecord = updateSalesforceRecord;
function escapeContent(content) {
    return content.replace(/'/g, "\\'").replace(/"/g, '\\"');
}


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.queryOrg = void 0;
const vscode = __importStar(__webpack_require__(1));
const child_process_1 = __webpack_require__(3);
const path = __importStar(__webpack_require__(5));
const outputs_1 = __webpack_require__(4);
const p_queue_1 = __importDefault(__webpack_require__(10));
const attachSaveListener_1 = __webpack_require__(7);
const updateQueue = new p_queue_1.default({ concurrency: 1 });
const fileDetailsMapping = [
    { objectType: 's_c__Content_Block__c', field: 's_c__Content_Markdown__c', extension: 'liquid', nameField: 's_c__Identifier__c', directory: 'Content_Blocks' },
    { objectType: 's_c__Theme_Template__c', field: 's_c__Content__c', extension: 'liquid', nameField: 's_c__Key__c', directory: 'Theme_Templates' },
    { objectType: 's_c__Style_Block__c', field: 's_c__Content__c', extension: 'css', nameField: 'Name', directory: 'Style_Blocks' },
    { objectType: 's_c__Article__c', field: 's_c__Body_Markdown__c', extension: 'md', nameField: 's_c__Slug__c', directory: 'Articles' }
];
async function queryOrg() {
    const orgAlias = vscode.workspace.getConfiguration('storeConnect').get('orgAlias');
    if (!orgAlias) {
        (0, outputs_1.showError)('No Salesforce organization alias is configured.');
        return;
    }
    for (const detail of fileDetailsMapping) {
        const query = `sfdx force:data:soql:query -q "SELECT Id, ${detail.nameField}, ${detail.field} FROM ${detail.objectType}" -o ${orgAlias} --json`;
        (0, child_process_1.exec)(query, async (error, stdout, stderr) => {
            if (error) {
                (0, outputs_1.showError)(`Error querying Salesforce: ${error.message}`);
                return;
            }
            if (stderr) {
                (0, outputs_1.showError)(`SOQL Error: ${stderr}`);
                return;
            }
            try {
                const data = JSON.parse(stdout);
                if (data.result.records && data.result.records.length > 0) {
                    await handleRecords(data.result.records, detail, orgAlias);
                }
                else {
                    (0, outputs_1.log)(`No records found for ${detail.objectType}.`);
                }
            }
            catch (error) {
                // Check if error is an instance of Error
                if (error instanceof Error) {
                    (0, outputs_1.showError)(`Error parsing query results: ${error.message}`);
                }
                else {
                    // If it's not an Error object, handle it as a generic error
                    (0, outputs_1.showError)(`An unexpected error occurred: ${String(error)}`);
                }
            }
        });
    }
}
exports.queryOrg = queryOrg;
async function handleRecords(records, detail, orgAlias) {
    const directoryPath = path.join(vscode.workspace.rootPath || '', detail.directory);
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(directoryPath));
    for (const record of records) {
        const fileName = record[detail.nameField].replace(/\//g, '|') + '.' + detail.extension;
        const content = record[detail.field];
        const filePath = path.join(directoryPath, fileName);
        try {
            await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(content));
            (0, outputs_1.showInfo)(`File created: ${filePath}`);
            await updateSettingsJson(filePath, detail.objectType, detail.field, record.Id);
            attachSaveListener_1.WatcherManager.initializeIgnore(filePath);
            attachSaveListener_1.WatcherManager.attach({ localPath: filePath, salesforceObject: detail.objectType, salesforceField: detail.field, salesforceRecordId: record.Id }, orgAlias);
        }
        catch (err) {
            (0, outputs_1.showError)(`Failed to write file: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}
async function updateSettingsJson(localPath, objectType, field, recordId) {
    await updateQueue.add(async () => {
        const config = vscode.workspace.getConfiguration('storeConnect');
        let existingMappings = await config.get('fileMappings', []);
        const mappingExists = existingMappings.some(mapping => mapping.localPath === localPath);
        if (!mappingExists) {
            const newMapping = { localPath, salesforceObject: objectType, salesforceField: field, salesforceRecordId: recordId };
            existingMappings.push(newMapping);
            try {
                await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
            }
            catch (error) {
                console.error('Failed to update configuration:', error);
            }
        }
    });
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PQueue)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var p_timeout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _priority_queue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);



/**
Promise queue with concurrency control.
*/
class PQueue extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    #carryoverConcurrencyCount;
    #isIntervalIgnored;
    #intervalCount = 0;
    #intervalCap;
    #interval;
    #intervalEnd = 0;
    #intervalId;
    #timeoutId;
    #queue;
    #queueClass;
    #pending = 0;
    // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
    #concurrency;
    #isPaused;
    #throwOnTimeout;
    /**
    Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.

    Applies to each future operation.
    */
    timeout;
    // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
    constructor(options) {
        super();
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = {
            carryoverConcurrencyCount: false,
            intervalCap: Number.POSITIVE_INFINITY,
            interval: 0,
            concurrency: Number.POSITIVE_INFINITY,
            autoStart: true,
            queueClass: _priority_queue_js__WEBPACK_IMPORTED_MODULE_2__["default"],
            ...options,
        };
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ''}\` (${typeof options.interval})`);
        }
        this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
        this.#intervalCap = options.intervalCap;
        this.#interval = options.interval;
        this.#queue = new options.queueClass();
        this.#queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this.timeout = options.timeout;
        this.#throwOnTimeout = options.throwOnTimeout === true;
        this.#isPaused = options.autoStart === false;
    }
    get #doesIntervalAllowAnother() {
        return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
    }
    get #doesConcurrentAllowAnother() {
        return this.#pending < this.#concurrency;
    }
    #next() {
        this.#pending--;
        this.#tryToStartAnother();
        this.emit('next');
    }
    #onResumeInterval() {
        this.#onInterval();
        this.#initializeIntervalIfNeeded();
        this.#timeoutId = undefined;
    }
    get #isIntervalPaused() {
        const now = Date.now();
        if (this.#intervalId === undefined) {
            const delay = this.#intervalEnd - now;
            if (delay < 0) {
                // Act as the interval was done
                // We don't need to resume it here because it will be resumed on line 160
                this.#intervalCount = (this.#carryoverConcurrencyCount) ? this.#pending : 0;
            }
            else {
                // Act as the interval is pending
                if (this.#timeoutId === undefined) {
                    this.#timeoutId = setTimeout(() => {
                        this.#onResumeInterval();
                    }, delay);
                }
                return true;
            }
        }
        return false;
    }
    #tryToStartAnother() {
        if (this.#queue.size === 0) {
            // We can clear the interval ("pause")
            // Because we can redo it later ("resume")
            if (this.#intervalId) {
                clearInterval(this.#intervalId);
            }
            this.#intervalId = undefined;
            this.emit('empty');
            if (this.#pending === 0) {
                this.emit('idle');
            }
            return false;
        }
        if (!this.#isPaused) {
            const canInitializeInterval = !this.#isIntervalPaused;
            if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
                const job = this.#queue.dequeue();
                if (!job) {
                    return false;
                }
                this.emit('active');
                job();
                if (canInitializeInterval) {
                    this.#initializeIntervalIfNeeded();
                }
                return true;
            }
        }
        return false;
    }
    #initializeIntervalIfNeeded() {
        if (this.#isIntervalIgnored || this.#intervalId !== undefined) {
            return;
        }
        this.#intervalId = setInterval(() => {
            this.#onInterval();
        }, this.#interval);
        this.#intervalEnd = Date.now() + this.#interval;
    }
    #onInterval() {
        if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = undefined;
        }
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
        this.#processQueue();
    }
    /**
    Executes all queued functions until it reaches the limit.
    */
    #processQueue() {
        // eslint-disable-next-line no-empty
        while (this.#tryToStartAnother()) { }
    }
    get concurrency() {
        return this.#concurrency;
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this.#concurrency = newConcurrency;
        this.#processQueue();
    }
    async #throwOnAbort(signal) {
        return new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => {
                reject(signal.reason);
            }, { once: true });
        });
    }
    async add(function_, options = {}) {
        options = {
            timeout: this.timeout,
            throwOnTimeout: this.#throwOnTimeout,
            ...options,
        };
        return new Promise((resolve, reject) => {
            this.#queue.enqueue(async () => {
                this.#pending++;
                this.#intervalCount++;
                try {
                    options.signal?.throwIfAborted();
                    let operation = function_({ signal: options.signal });
                    if (options.timeout) {
                        operation = (0,p_timeout__WEBPACK_IMPORTED_MODULE_1__["default"])(Promise.resolve(operation), { milliseconds: options.timeout });
                    }
                    if (options.signal) {
                        operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
                    }
                    const result = await operation;
                    resolve(result);
                    this.emit('completed', result);
                }
                catch (error) {
                    if (error instanceof p_timeout__WEBPACK_IMPORTED_MODULE_1__.TimeoutError && !options.throwOnTimeout) {
                        resolve();
                        return;
                    }
                    reject(error);
                    this.emit('error', error);
                }
                finally {
                    this.#next();
                }
            }, options);
            this.emit('add');
            this.#tryToStartAnother();
        });
    }
    async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */
    start() {
        if (!this.#isPaused) {
            return this;
        }
        this.#isPaused = false;
        this.#processQueue();
        return this;
    }
    /**
    Put queue execution on hold.
    */
    pause() {
        this.#isPaused = true;
    }
    /**
    Clear the queue.
    */
    clear() {
        this.#queue = new this.#queueClass();
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */
    async onEmpty() {
        // Instantly resolve if the queue is empty
        if (this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('empty');
    }
    /**
    @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.

    If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.

    Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
    */
    async onSizeLessThan(limit) {
        // Instantly resolve if the queue is empty.
        if (this.#queue.size < limit) {
            return;
        }
        await this.#onEvent('next', () => this.#queue.size < limit);
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */
    async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (this.#pending === 0 && this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('idle');
    }
    async #onEvent(event, filter) {
        return new Promise(resolve => {
            const listener = () => {
                if (filter && !filter()) {
                    return;
                }
                this.off(event, listener);
                resolve();
            };
            this.on(event, listener);
        });
    }
    /**
    Size of the queue, the number of queued items waiting to run.
    */
    get size() {
        return this.#queue.size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */
    sizeBy(options) {
        // eslint-disable-next-line unicorn/no-array-callback-reference
        return this.#queue.filter(options).length;
    }
    /**
    Number of running items (no longer in the queue).
    */
    get pending() {
        return this.#pending;
    }
    /**
    Whether the queue is currently paused.
    */
    get isPaused() {
        return this.#isPaused;
    }
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),
/* 12 */
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   "default": () => (/* binding */ pTimeout)
/* harmony export */ });
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;

	const wrappedPromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	});

	const cancelablePromise = wrappedPromise.finally(() => {
		cancelablePromise.clear();
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PriorityQueue)
/* harmony export */ });
/* harmony import */ var _lower_bound_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);

class PriorityQueue {
    #queue = [];
    enqueue(run, options) {
        options = {
            priority: 0,
            ...options,
        };
        const element = {
            priority: options.priority,
            run,
        };
        if (this.size && this.#queue[this.size - 1].priority >= options.priority) {
            this.#queue.push(element);
            return;
        }
        const index = (0,_lower_bound_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.#queue, element, (a, b) => b.priority - a.priority);
        this.#queue.splice(index, 0, element);
    }
    dequeue() {
        const item = this.#queue.shift();
        return item?.run;
    }
    filter(options) {
        return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
        return this.#queue.length;
    }
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ lowerBound)
/* harmony export */ });
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
        const step = Math.trunc(count / 2);
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            first = ++it;
            count -= step + 1;
        }
        else {
            count = step;
        }
    }
    return first;
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map