# sc-vsc-webdev README

A VSCode extension designed to enhance the development workflow for StoreConnect Web Development (SCWD) and design in themes and website component records. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records.

Associate and sync VSCode .css, .js, .html, .liquid, .md, or any text-based files to a specific field for specific records in a Salesforce org.

## Features

1. **Authentication**: This extension manages Salesforce authentication securely, leveraging the Salesforce CLI (SFDX) features.

2. **Mapping Files to Salesforce Records**: This extension easily manages configuration and mappings between local files and StoreConnect Salesforce records.

3. **Real-Time Synchronization**: Listens for file save events and updates the corresponding Salesforce record immediately. Links VSCode.
    
4.  **User Interface in VSCode**: Creates a user-friendly interface within VSCode, including command palette actions and output logs.
    
5.  **Configuration and State Management**: Handles settings for each project, such as authentication for directories, toggling sync on/off, and managing these settings.
    

## Pre-requisites

This extension requires Salesforce CLI to be installed.

## Usage

### File and Folder Structure

Have a project folder that aligns with your Salesforce Org. This folder name is used to create the Org Alias in the authentication process. Recommend opening the Project folder of your StoreConnect org in VSCode as the primary top-level folder.

```lua
/your-org-project
|-- abcStyles.css
|-- abcMarkup.liquid
|-- abcActions.js
|-- abcArticle.md
|-- abcHead.html
|-- /Theme // Any folders to group site components or themes, etc.
  |-- componentstyles.css
  |-- componentmarkup.liquid
  |-- componentactions.js` 
```

### Authenticate Project Folder with Salesforce Org

1.  Ensure the Project folder is in view.
2.  Open Command Palette `Cmd + Shift + P`.
3.  Search for `SCWD: Authenticate` command. Selecting this will open a browser to authenticate with your Salesforce org.

### Link and Sync Project Files to Salesforce Records

1.  Ensure the project file is selected.
2.  Open Command Palette `Cmd + Shift + P`.
3.  Search for `SCWD: Link and Sync` and select the command.
4.  A prompt will ask for a string which identifies the record.
    -   The input structure is [SalesforceObject].[SalesforceField]:[RecordId]
    -   e.g., `s_c__Style_Block__c.s_c__Content__c:a2rGA000000xyAiYAI`

This file will now update the text of the file to the specified field of the Salesforce record, on save.

## Extension Settings

Located in `.vscode/settings.json`, this file can be edited manually to link and sync your files.

## Known Issues

TBD

## Release Notes

Alpha release - MVP end-to-end features workflow works in VSCode Development Environment. Supports Update function only.

### 1.0.0

Production Release

## For more information

Visit [https://getstoreconnect.com/](https://getstoreconnect.com/)

## Future Features

-   Insert New File
-   Upsert Function
-   Delete Function
-   Query existing files from Salesforce and create files in Project folder
-   Include clickable options in the footer bar, and indicators (e.g., icons) for sync status on files.

**Enjoy!**