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
