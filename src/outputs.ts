import * as vscode from 'vscode';

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
    log(message);
}

export function showInfo(message: string): void {
    vscode.window.showInformationMessage(message);
    log(message); 
}

export function showSuccess(message: string): void {
    vscode.window.showInformationMessage(message);
    log(message); 
}