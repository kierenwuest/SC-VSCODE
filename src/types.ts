export interface Mapping {
  localPath: string;
  salesforceObject: string;
  salesforceField: string;
  salesforceRecordId: string;
}

export interface FileDetails {
  objectType: string;
  field: string;
  extension: string;
  nameField: string;
  directory: string;
  subDirectory: string;
}

export interface SalesforceSession {
  accessToken: string;
  instanceUrl: string;
}

export interface FileDetails {
  objectType: string;
  directory: string;
  subDirectory: string;
  nameField: string;
  extension: string;
  field: string;
}

export const fileDetailsMapping: FileDetails[] = [
  { objectType: 's_c__Article__c', directory: 'Articles', subDirectory: 's_c__Store_Id__r.Name', nameField: 's_c__Slug__c', extension: 'md', field: 's_c__Body_Markdown__c' },
  { objectType: 's_c__Content_Block__c', directory: 'Content_Blocks', subDirectory: 's_c__Template__c', nameField: 's_c__Identifier__c', extension: 'liquid', field: 's_c__Content_Markdown__c' },
  { objectType: 's_c__Script_Block__c', directory: 'Script_Blocks', subDirectory: 's_c__Store_Id__r.Name', nameField: 'Name', extension: 'js', field: 's_c__Content__c' },
  { objectType: 's_c__Style_Block__c', directory: 'Style_Blocks', subDirectory: 's_c__Store_Id__r.Name', nameField: 'Name', extension: 'css', field: 's_c__Content__c' },
  { objectType: 's_c__Theme_Template__c', directory: 'Theme_Templates', subDirectory: 's_c__Theme_Id__r.Name', nameField: 's_c__Key__c', extension: 'liquid', field: 's_c__Content__c' }
];

export const baseSettings = (orgAlias: string, workspacePath: string, orgStatus: string ) => ({
  "storeConnect.orgAlias": orgAlias,
  "orgWorkfolder.Path": workspacePath,
  "cliOrgStatus": orgStatus,
  "Articles": {},
  "Content_Blocks": {},
  "Script_Blocks": {},
  "Style_Blocks": {},
  "Theme_Templates": {}
});