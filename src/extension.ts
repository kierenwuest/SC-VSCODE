// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { authenticate } from './commands/authenticate';

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

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.authenticate', () => {
			authenticate().then(() => {
					vscode.window.showInformationMessage('Authentication Successful!');
			}).catch(err => {
					vscode.window.showErrorMessage('Authentication Failed: ' + err.message);
			});
	});

	context.subscriptions.push(disposable);
}

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
export function deactivate() {}
