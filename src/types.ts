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
}