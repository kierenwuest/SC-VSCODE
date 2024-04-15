// outputs.ts
import * as vscode from 'vscode';

// Create a singleton output channel instance
const outputChannel = vscode.window.createOutputChannel("My Extension Logs");

export function log(message: string): void {
    outputChannel.appendLine(message);
}

export function showOutput(): void {
    outputChannel.show(true);
}

export function clearOutput(): void {
    outputChannel.clear();
}

export function showError(message: string): void {
    vscode.window.showErrorMessage(message);
    log(message);  // Also log the error to the output channel
}

export function showInfo(message: string): void {
    vscode.window.showInformationMessage(message);
    log(message);  // Also log the info to the output channel
}
