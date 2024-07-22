# VSC-WEBDEV README

A VSCode extension designed to enhance the development workflow for StoreConnect Web Development **(SCWD)** and design in themes and website component records. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records.

This extension enables the StoreConnect Web Developer, designer, partner, and administrator to use all the web development features and tools available in VSCode.

Associate and sync VSCode .css, .js, .html, .liquid, .md, or any text-based files to a specific field for specific records in a Salesforce org.

## Features

1. **Authentication**: This extension manages Salesforce authentication securely, leveraging the Salesforce CLI (SFDX) features.

2. **Mapping Files to Salesforce Records**: This extension easily manages configuration and mappings between local files and StoreConnect Salesforce records.

3. **File Save Updated Salesfroce Records**: Listens for file save events and updates the corresponding Salesforce record immediately.

4. **User Interface in VSCode**: Creates a user-friendly interface within VSCode, including command palette actions and output logs.

5. **Configuration and State Management**: Handles settings for each project.

## Pre-requisites

1. This extension requires [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli) to be installed.
2. Optional: [Salesfore Extensions](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode) may be benficial.

## Alpha Installation and Run

1. Clone this repository.
2. Ensure [Node.js](https://nodejs.org/en) and npm are installed.

    ```bash
    node -v
    npm -v
    ```

3. Install dependencies with `npm install`.
4. Run `npm run compile`.
5. Via the Run and Debug sidebar in VSCode, click the Green Play button on 'Run Extension' to launch the extension in a development host instance of VSCode.

## Usage

### File and Folder Structure

Have a project folder that aligns with your Salesforce Org. This folder name is used to create the Org Alias in the authentication process. Recommend opening the Project folder of your StoreConnect org in VSCode as the primary top-level folder.

```lua
WorkspaceFolder
├── .vscode
│   └── settings.json
├──[objectType: 's_c__Article__c', directory: 'Articles']
│   └──[subDirectory: 's_c__Store_Id__r.Name']
│       └──[nameField: 's_c__Slug__c', extension: 'md']
├──[objectType: 's_c__Content_Block__c', directory: 'Content_Blocks']
│   └──[subDirectory: 's_c__Template__c']
│       └───[nameField: 's_c__Identifier__c',extension: 'liquid']
├──[objectType: 's_c__Script_Block__c', directory: 'Script_Blocks']
│   └──[subDirectory: 's_c__Store_Id__r.Name']
│       └──[nameField: 'Name', extension: 'js']
├──[objectType: 's_c__Style_Block__c', directory: 'Style_Blocks']
│   └──[subDirectory: 's_c__Store_Id__r.Name']
│       └──[nameField: 'Name', extension: 'css']
└──[objectType: 's_c__Theme_Template__c', directory: 'Theme_Templates']
    └──[subDirectory: 's_c__Theme_Id__r.Name']
       └──[subdirectories and filename: nameField: 's_c__Key__c', extension: 'liquid']
```

### Authenticate Project Folder with Salesforce Org

1. Open Command Palette `Cmd + Shift + P`.
2. Search for `SCWD: Authenticate` command. Selecting this will open a browser to authenticate with your Salesforce org.
3. This will authenticate the org in salesforce CLI which this plugin uses to connect with saleforce.

### Query Salesforce Org for StoreConnect Web Front-end Records

1. Ensure 'SCWD: Authenticate' step has been done.
2. Open Command Palette `Cmd + Shift + P`.
3. Search for `SCWD: Query Org` command. Select the command to execute it.

This command will query the authenticated org (defined in the settings.json) for a set of StoreConnect records which are typically used to manage the front end of your StoreConnect site/stores.

* Articles - slug.md
* Content Blocks - identifier.liquid
* Script Blocks - Name.js
* Style Blocks - Name.css
* Theme Templates - path|key.liquid

**Note** This could extend in future versions to nested files and special files as follows

* Store Fields
* Pages
* Product Categories
* Product Fields
* Media
* Theme Assets
* Theme Translations
* Theme Variables
* Store Variables
* Other Objects that display site content in Markdown such as Locations, Collection Points, Payment Provider

This feature intends to be improved with folder organisation and options.

### New Record - Create a new record in Salesforce from a new file in a sub directory

1. After creating a file in an approprate sub directory (see subDirectory: in File and Folder Structure).
2. Right click the file and select SCWD: Create new Salesforce record.
3. Based on the folder where the file is located it will create a corresponding salesforce StoreConnect content record.

## Extension Settings

Located in `.vscode/settings.json`, this file can be edited manually review config your files.

## Known Issues

* When creating a new record in salesforce via the new file righ click command. It will save the content to salesforce after the second save event. 
* Query Org: Will not pull any files with enpty content fields.
