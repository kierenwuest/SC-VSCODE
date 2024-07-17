import * as vscode from 'vscode';
import axios from 'axios';
import { exec } from 'child_process';
import { showError, showInfo, showSuccess } from './outputs';
import { Mapping, SalesforceSession } from './types'; 

function getSalesforceSession(orgAlias: string): Promise<SalesforceSession> {
    const command = `sfdx force:org:display --json --targetusername ${orgAlias}`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
                return;
            }
            try {
                const data = JSON.parse(stdout);
                resolve({ accessToken: data.result.accessToken, instanceUrl: data.result.instanceUrl });
            } catch (error) {
                if (error instanceof Error) {
                    reject(`Failed to parse response: ${error.message}`);
                } else {
                    reject(`An unexpected parsing error occurred`);
                }
            }
        });
    });
}

export async function querySalesforceRecord(query: string, orgAlias: string): Promise<any[]> {
  const session = await getSalesforceSession(orgAlias);
  const url = `${session.instanceUrl}/services/data/v53.0/query?q=${encodeURIComponent(query)}`;

  const response = await axios({
      method: 'get',
      url,
      headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
      }
  });

  return response.data.records;
}

export async function updateSalesforceRecord(mapping: Mapping, uri: vscode.Uri, orgAlias: string) {
    try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const content = doc.getText();

        const session = await getSalesforceSession(orgAlias);
        const url = `${session.instanceUrl}/services/data/v53.0/sobjects/${mapping.salesforceObject}/${mapping.salesforceRecordId}`;
        const data = {
            [mapping.salesforceField]: content
        };

        const response = await axios({
            method: 'patch',
            url,
            data,
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 204) {
            showInfo('Salesforce record updated successfully.');
        } else {
            showError(`Failed to update record: ${response.status}`);
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            showError(`Error during Salesforce update: ${error.response.data}`);
        } else if (error instanceof Error) {
            showError(`Update error: ${error.message}`);
        } else {
            showError(`An unexpected error occurred`);
        }
    }
}

export async function createSalesforceRecord(objectType: string, record: any, orgAlias: string): Promise<void> {
  try {
      const session = await getSalesforceSession(orgAlias);
      const url = `${session.instanceUrl}/services/data/v53.0/sobjects/${objectType}`;
      const response = await axios({
          method: 'post',
          url,
          data: record,
          headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json'
          }
      });

      if (response.status === 201) {
          showSuccess(`Record created: ${response.data.id}`);
      } else {
          showError(`Failed to create record: ${response.status}`);
      }
  } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          showError(`Error during Salesforce creation: ${error.response.data}`);
      } else if (error instanceof Error) {
          showError(`Creation error: ${error.message}`);
      } else {
          showError(`An unexpected error occurred`);
      }
      throw error;
  }
}