import * as vscode from 'vscode';
import { create } from 'simple-oauth2';

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

const oauth2 = create(credentials);

export async function authenticate() {
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: 'http://localhost:1717/callback',
        scope: 'api id web',
        state: Math.random().toString(36).substring(2) // Random state for security
    });

    vscode.env.openExternal(vscode.Uri.parse(authorizationUri));
}

