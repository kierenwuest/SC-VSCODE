# VSC-WEBDEV README

A VSCode extension designed to enhance the development workflow for StoreConnect Web Development **(SCWD)** and design in themes and website component records. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records.

This extension enables the StoreConnect Web Developer, designer, partner, and administrator to use all the web development features and tools available in VSCode.

Associate and sync VSCode .css, .js, .html, .liquid, .md, or any text-based files to a specific field for specific records in a Salesforce org.

## Features

1. **Authentication**: This extension manages Salesforce authentication securely, leveraging the Salesforce CLI (SFDX) features.

2. **Mapping Files to Salesforce Records**: This extension easily manages configuration and mappings between local files and StoreConnect Salesforce records.

3. **Real-Time Synchronization**: Listens for file save events and updates the corresponding Salesforce record immediately.

4. **User Interface in VSCode**: Creates a user-friendly interface within VSCode, including command palette actions and output logs.

5. **Configuration and State Management**: Handles settings for each project, such as authentication for directories, toggling sync on/off, and managing these settings.

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
/Your-Org-Project
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

1. Ensure the Project folder is in view.
2. Open Command Palette `Cmd + Shift + P`.
3. Search for `SCWD: Authenticate` command. Selecting this will open a browser to authenticate with your Salesforce org.

### Query Salesforce Org for StoreConnect Web Front-end Records

1. Ensure the Working Project folder is in view and the 'SCWD: Authenticate' step has been done.
2. Open Command Palette `Cmd + Shift + P`.
3. Search for `SCWD: Query Org` command. Select the command to execute it.

This command will (current version) query the authenticated org (defined in the settings.json) for a set of StoreConnect records which are typically used to manage the front end of your StoreConnect site/stores.

* Content Blocks
* Theme Templates
* Script Blocks

This command will create files in the working folder named based on the following Salesforce data and give the file types:

* Articles - slug.md
* Content Blocks - identifier.liquid
* Theme Templates - path|key.liquid
* Script Blocks - Name.css

**Note** This will extend in future versions as follows

* Script Blocks - *.js
* Store Fields - FieldName.liquid
* Pages - *.liquid
* Product Categories - FieldName.md
* Product Fields - FieldName.md
* Theme Assets - *.css
* Theme Translations - *.csv
* Theme Variables
* Store Variables
* Other Objects that display site content in Markdown such as Locations, Collection Points, Payment Provider

This feature intends to be improved with folder organisation and options.

### Link and Sync Project Files to Salesforce Records

1. Ensure the project file is selected.
2. Open Command Palette `Cmd + Shift + P`.
3. Search for `SCWD: Link and Sync` and select the command.
4. A prompt will ask for a string that identifies the record.
    * The input structure is [SalesforceObject.SalesforceField:RecordId]
    * e.g., `s_c__Style_Block__c.s_c__Content__c:a2rGA000000xyAiYAI`

This file will now update the text of the file to the specified field of the Salesforce record, on save utilising sfdx commands.

This feature intends to be improved with upsert capability for new files created in VSCode

## Extension Settings

Located in `.vscode/settings.json`, this file can be edited manually to link and sync your files.

## Known Issues

 Link and Sync input (opening the command, then changing windows to form the string and copy/paste, closes the input box requiring the command to be re-entered) goal is to have an input box that stays open when the window focus changes. Or have a better UX soltuion.

## Release Notes and Target Roadmap

### 0.1.0 Alpha MVP

1. End-to-end Authenticate and Update work as expected in the VSCode Development Debug Environment.

* Authenticate command authenticates folder to salesforce org. Updates settings.json.
* The link and Sync command will update the salesforce record. Updates settings.json.

### 0.2.0 Alpha (Current)

1. Query Org command implemented
