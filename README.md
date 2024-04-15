# sc-vsc-webdev README

A VSCode extension designed to enhance the development workflow for StoreConnect Web Development (SCWD) and design in themes and website component records. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records.

Associate and sync vscode .css .js .html .liquid .md or any text based files to a specific field for specific records in a salesforce org.

## Features

1. **Authentication**: This extension manages Salesforce authentication securely leveraging the Salesforce CLI (SFDX) features.

2. **Mapping Files to Salesforce Records**: This extension easily manages configuration and mappings between local files and StoreConnect Salesforce records.

3. **Real-Time Synchronization**: Listening for file save events and updating the corresponding Salesforce record immediately. Link Vscode

4. **User Interface in VSCode**: Creating a user-friendly interface within VSCode, command palette actions and output logs.

5. **Configuration and State Management**: Handling settings for each project, such as authentication for directories, toggling sync on/off, and managing these settings.

## Pre-requisites

This extension requires Salesforce CLI to be installed.

## Usage

### File and Folder Structure

Have a project folder that aligns with your salesforce Org. This folder name is used to create the Org Alias in the Authenticate process. Recomend opening the Project folder of your StorceConnect org in VScode as the priary top level folder

```lua
/your-org-project
|-- abcStyles.css
|-- abcMarkup.liquid
|-- abcActions.js
|-- abcArticle.md
|-- abcHead.html
|-- /Theme // Any folders to group site components or themes etc
  |-- componentstyles.css
  |-- componentmarkup.liquid
  |-- componentactions.js
```

### Authenticate Project folder with salesforce org

1. Ensure Project folder is in view
2. Open Command Palette `Cmd + Shift + P`
3. Search for `SCWD: Authenticate` command. Selecting this will open a browser to authenticate with your salesfroce org.

### Link and Sync project files to salesforce records.
1. Ensure project file is selected
2. Open Command Palette `Cmd + Shift + P`
3. Search for `SCWD: Link and Sync` and select the command
4. A prompt will ask for a string which identifies the record. 
  - The input structure is [SalesforceObject].[SalesforceField]:[RecordId]
  - eg: `s_c__Style_Block__c.s_c__Content__c:a2rGA000000xyAiYAI`

This file will now update the text of the file to the specified field of salesforce record, on save.

## Extension Settings

Located in `.vscode/settings.json` this file can be edited manually to link and sync your files.

## Known Issues

TBD

## Release Notes

Alpha release - MVP end to end features workflow works in VSCoce Development Environment
Supports Update function only.

### 1.0.0

Production Release

## For more information

Visit https://getstoreconnect.com/

## Future Features

* Insert New File
* Upsert Function
* Delete Function
* Query existing files from Salesforce and create files in Project folder
* Include clickable options in the footer bar, and indicators (e.g., icons) for sync status on files.

**Enjoy!**
