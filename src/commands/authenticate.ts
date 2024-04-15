import * as vscode from 'vscode';
import { AuthorizationCode } from 'simple-oauth2';

const clientConfig = {
    client: {
        id: 'YOUR_CLIENT_ID',
        secret: 'YOUR_CLIENT_SECRET'
    },
    auth: {
        tokenHost: 'https://login.salesforce.com',
        tokenPath: '/services/oauth2/token',
        authorizePath: '/services/oauth2/authorize'
    }
};

const client = new AuthorizationCode(clientConfig);

export async function authenticate() {
    const authorizationUri = client.authorizeURL({
        redirect_uri: 'http://localhost:1717/callback',
        scope: 'api id web',
        state: Math.random().toString(36).substring(2) // Random state for security
    });

    vscode.env.openExternal(vscode.Uri.parse(authorizationUri));
}