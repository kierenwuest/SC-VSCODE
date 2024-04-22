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

### Link and Sync Project Files to Salesforce Records

1. Ensure the project file is selected.
2. Open Command Palette `Cmd + Shift + P`.
3. Search for `SCWD: Link and Sync` and select the command.
4. A prompt will ask for a string that identifies the record.
    - The input structure is [SalesforceObject.SalesforceField:RecordId]
    - e.g., `s_c__Style_Block__c.s_c__Content__c:a2rGA000000xyAiYAI`

This file will now update the text of the file to the specified field of the Salesforce record, on save.
It utilises the sfdx command `sfdx force:data:record:update -s {ObjectAPIName} -i {RecordId} -v "{FieldAPIName}='{Content}'" -o {OrgAlias} --json`

## Extension Settings

Located in `.vscode/settings.json`, this file can be edited manually to link and sync your files.

## Known Issues

 Link and Sync input (opening the command, then changing windows to form the string and copy/paste, closes the input box requiring the command to be re-entered) goal is to have an input box that stays open when the window focus changes. Or have a better UX soltuion.

## Release Notes and Target Roadmap

### 0.1.0 Alpha MVP (Current)

- End-to-end features and workflow work as expected in the VSCode Development Debug Environment.
  - Authenticate command authenticates folder to salesforce org. Updates settings.json.
  - The link and Sync command will update the salesforce record. Updates settings.json.
- Supports Update function only.

### 0.2.0 Alpha (Placeholder)

1. Develop Further Error Handling Scenarios

    Robust error handling will provide users with clear information on what went wrong.

2. Improve Link and Sync Input Usability

    Enhancing the input method to keep the input box open when the window focus changes will improve the user experience and reduce frustration, making the extension more practical for regular use.

3. Develop Tests

    Writing tests for the existing functionalities to help ensure that the extension is stable and functions as expected, reducing bugs and issues as new features are added.

4. Change the localhost URL in Authenticate

    When the extension will be used by others outside your local development environment, you'll need to replace the localhost URL with a production URL or implement a more dynamic solution, possibly involving a redirect URI that can handle the OAuth callback more flexibly.

### 0.9.0 Beta (Placeholder)

1. Add New CORE Features

    - Insert Operation: A file can create a new salesforce record.
    - Upsert Operation: Insert and Update based on a group of files in the project folder.
    - New command to Query existing Salesforce records and create files in the project folder.
      - Content Block
      - Theme Template
      - Style Block
      - Script Block
      - Article
      - Page
      - Product
      - Product Category
      - Store
    - Unlink Command

2. Quality of Life Improvements

    Adding clickable options in the footer bar and indicators on files for sync status will improve the user interface and make the extension more intuitive.

3. Security Review

    Even though security is based on leveraging Salesforce CLI, ensure that all data handling is secure, and consider common security concerns like SQL injection, secure storage of tokens, and data privacy.

### 1.0.0-rc.1 Release Candidate (Placeholder)

1. Documentation

    Complete comprehensive documentation ensuring that users understand how to install, configure, and use your extension effectively. This includes setup instructions, usage examples, and troubleshooting tips.

2. Enable User Feedback Loop

    Establish a method for collecting user feedback once the extension is in use. This could be through GitHub issues or direct communication channels.

3. Refactor and Performance Optimization

    Features are added and expand the extension's capabilities, refactoring code to remain as simple as possible and fast performing.

4. Establish Support Channel

    The level of support required is yet to be determined.

### 1.0.0 Production Release (Placeholder)

1. Publish on VSCode Marketplace

    Make the extension public and distributable to StoreConnect customers, partners, admins and prospects.

2. Publish a How-to Article showcasing benefits, QOL improvements and time savings.

    Make the extension public and distributable to StoreConnect customers, partners, admins and prospects.  

## For more information

Visit [https://getstoreconnect.com/](https://getstoreconnect.com/)

## Future Feature Ideas

- StoreConnect Theme template clone and project directory setup
