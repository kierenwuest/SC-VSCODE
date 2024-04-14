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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(__webpack_require__(1));
const authenticate_1 = __webpack_require__(2);
/* // This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sc-vsc-webdev" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('sc-vsc-webdev.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from StoreConnect VSC WebDev!');
    });

    context.subscriptions.push(disposable);
} */
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.authenticate', () => {
        (0, authenticate_1.authenticate)().then(() => {
            vscode.window.showInformationMessage('Authentication Successful!');
        }).catch(err => {
            vscode.window.showErrorMessage('Authentication Failed: ' + err.message);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// Function to read configuration
function getFileMappings() {
    const config = vscode.workspace.getConfiguration('storeConnect');
    const fileMappings = config.get('fileMappings');
    return fileMappings;
}
// Function to update or add a new mapping
function addFileMapping(mapping) {
    const config = vscode.workspace.getConfiguration('storeConnect');
    let fileMappings = config.get('fileMappings', []);
    fileMappings.push(mapping);
    config.update('fileMappings', fileMappings, vscode.ConfigurationTarget.Workspace);
}
// Example usage of addFileMapping
addFileMapping({
    localPath: 'path/to/file.css',
    salesforceObject: 'CustomObject__c',
    salesforceField: 'Content__c',
    salesforceRecordId: 'a0X1I00000XXXXXUAW'
});
vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('storeConnect.fileMappings')) {
        const updatedMappings = getFileMappings();
        // Handle the updated mappings, such as re-syncing files
        console.log('Configurations updated:', updatedMappings);
    }
});
// This method is called when your extension is deactivated
function deactivate() { }
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
const simple_oauth2_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'simple-oauth2'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const credentials = {
    client: {
        id: '3MVG929eOx29turFQ0fXnYkUTlvZxTNM0iGjQOdLAhdGQLo92.w4snZRv12FP6jejeY11NxhdX7hXndaab0ac',
        secret: 'E53D60D015FE1C4DA44B4BA6382FDA866F76151A6A00550BDBC4EC65B690E6DD'
    },
    auth: {
        tokenHost: 'https://login.salesforce.com',
        tokenPath: '/services/oauth2/token',
        authorizePath: '/services/oauth2/authorize'
    }
};
const oauth2 = (0, simple_oauth2_1.create)(credentials);
async function authenticate() {
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: 'http://localhost:1717/callback',
        scope: 'api id web',
        state: Math.random().toString(36).substring(2) // Random state for security
    });
    vscode.env.openExternal(vscode.Uri.parse(authorizationUri));
}
exports.authenticate = authenticate;


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