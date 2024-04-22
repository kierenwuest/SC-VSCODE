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
const outputs_1 = __webpack_require__(4);
function activate(context) {
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate_1.authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync_1.linkAndSync);
    context.subscriptions.push(authenticateCommand, linkAndSyncCommand);
    (0, outputs_1.showInfo)("SCWD Ready"); // Inform user that extension is ready
}
exports.activate = activate;
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
const child_process_1 = __webpack_require__(3);
const path = __importStar(__webpack_require__(5));
const outputs_1 = __webpack_require__(4);
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
        existingMappings.push(newMapping);
        await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
        (0, outputs_1.showInfo)("Salesforce link and sync configuration saved.");
        attachSaveListener(newMapping, orgAlias); // Correctly call attachSaveListener here
    }
    else {
        (0, outputs_1.showError)("All components must be provided in the format [Object].[Field]:[RecordID], and a file must be open.");
    }
}
exports.linkAndSync = linkAndSync;
let activeWatchers = new Map();
function attachSaveListener(mapping, orgAlias) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(mapping.localPath));
    if (!workspaceFolder) {
        (0, outputs_1.showError)("Workspace folder not found for the given file path.");
        return;
    }
    const pattern = new vscode.RelativePattern(workspaceFolder, '**/' + path.basename(mapping.localPath));
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(uri => {
        (0, outputs_1.log)(`File Changed: ${uri.fsPath}`);
        updateSalesforceRecord(mapping, uri, orgAlias);
    });
    watcher.onDidCreate(uri => {
        (0, outputs_1.log)(`File Created: ${uri.fsPath}`);
        updateSalesforceRecord(mapping, uri, orgAlias);
    });
    watcher.onDidDelete(uri => {
        (0, outputs_1.log)(`File Deleted: ${uri.fsPath}`);
        activeWatchers.get(mapping.localPath)?.dispose();
        activeWatchers.delete(mapping.localPath);
    });
    if (activeWatchers.has(mapping.localPath)) {
        activeWatchers.get(mapping.localPath)?.dispose();
    }
    activeWatchers.set(mapping.localPath, watcher);
}
function updateSalesforceRecord(mapping, uri, orgAlias) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        const content = doc.getText();
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '\\"'); // Escape single quotes and double quotes
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
                const errorMessage = (error instanceof Error) ? error.message : 'Error parsing Salesforce response';
                (0, outputs_1.showError)(errorMessage);
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