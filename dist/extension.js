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
const linkAndSync_1 = __webpack_require__(4);
function activate(context) {
    let authenticateCommand = vscode.commands.registerCommand('sc-vsc-webdev.authenticate', authenticate_1.authenticate);
    let linkAndSyncCommand = vscode.commands.registerCommand('sc-vsc-webdev.linkAndSync', linkAndSync_1.linkAndSync);
    context.subscriptions.push(authenticateCommand, linkAndSyncCommand);
}
exports.activate = activate;
function deactivate() {
    // Clean up if needed
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
const child_process_1 = __webpack_require__(6);
function authenticate() {
    // Command to authenticate using Salesforce CLI
    const command = 'sfdx force:auth:web:login -a vscodeOrg -r https://login.salesforce.com';
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
        console.log(stdout); // Output the result of the CLI command
    });
}
exports.authenticate = authenticate;


/***/ }),
/* 3 */,
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
exports.linkAndSync = void 0;
const vscode = __importStar(__webpack_require__(1));
const child_process_1 = __webpack_require__(6);
async function linkAndSync() {
    const input = await vscode.window.showInputBox({ prompt: 'Enter configuration as [Object].[Field]:[RecordID]' });
    if (!input) {
        vscode.window.showErrorMessage("Input was cancelled or empty.");
        return;
    }
    const pattern = /^(.+)\.(.+):(.+)$/;
    const match = input.match(pattern);
    if (!match) {
        vscode.window.showErrorMessage("Input format is incorrect. Please use the format [Object].[Field]:[RecordID]");
        return;
    }
    const [_, salesforceObject, salesforceField, salesforceRecordId] = match;
    if (salesforceObject && salesforceField && salesforceRecordId) {
        const config = vscode.workspace.getConfiguration('storeConnect');
        let existingMappings = config.get('fileMappings', []);
        const newMapping = { salesforceObject, salesforceField, salesforceRecordId };
        existingMappings.push(newMapping);
        await config.update('fileMappings', existingMappings, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage("Salesforce link and sync configuration saved.");
        attachSaveListener(newMapping);
    }
    else {
        vscode.window.showErrorMessage("All components must be provided in the format [Object].[Field]:[RecordID].");
    }
}
exports.linkAndSync = linkAndSync;
function attachSaveListener(mapping) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.getWorkspaceFolder(activeEditor.document.uri), activeEditor.document.fileName));
        watcher.onDidChange(uri => {
            updateSalesforceRecord(mapping, uri);
        });
    }
}
function updateSalesforceRecord(mapping, uri) {
    vscode.workspace.openTextDocument(uri).then(doc => {
        let content = doc.getText();
        const updateCommand = `sfdx force:data:record:update -s ${mapping.salesforceObject} -i ${mapping.salesforceRecordId} -v "${mapping.salesforceField}='${content.replace(/'/g, "\\'")}'" --json`;
        (0, child_process_1.exec)(updateCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Update error: ${error}`);
                vscode.window.showErrorMessage(`Failed to update Salesforce record: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error updating Salesforce: ${stderr}`);
                vscode.window.showErrorMessage(`Error during Salesforce update: ${stderr}`);
                return;
            }
            try {
                const response = JSON.parse(stdout);
                if (response.status === 0) {
                    vscode.window.showInformationMessage('Salesforce record updated successfully.');
                }
                else {
                    vscode.window.showErrorMessage(`Failed to update Salesforce record: ${response.message}`);
                }
            }
            catch (parseError) {
                console.error(`Error parsing Salesforce response: ${parseError}`);
                vscode.window.showErrorMessage('Error parsing Salesforce response.');
            }
        });
    });
}


/***/ }),
/* 5 */,
/* 6 */
/***/ ((module) => {

module.exports = require("child_process");

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