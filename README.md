# sc-vsc-webdev README

A VSCode extension tailored specifically to enhance the development workflow for StoreConnect CMS themes and website components. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records. Below, I'll outline some key technical considerations and steps to get started with building this extension.

## Features

1. **Authentication**: Managing Salesforce authentication securely, especially when working with multiple environments (e.g., development, staging, production).

2. **Mapping Files to Salesforce Records**: The ability to configure and store mappings between local files and Salesforce records (Object, Id, Field).

3. **Real-Time Synchronization**: Listening for file save events and updating the corresponding Salesforce record immediately.

4. **User Interface in VSCode**: Creating a user-friendly interface within VSCode, including clickable options in the footer bar, command palette actions, and indicators (e.g., icons) for sync status.

5. **Configuration and State Management**: Handling settings for each project, such as authentication for directories, toggling sync on/off, and maintaining these settings persistently.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

- A VSCode extension that works with the web development aspects of the StoreConnect application on salesforce.
- StoreConnect has CMS capabilities which render front end website code from data stored in a salesforce org.
  - For example a Style Block record will have an Object, Id and a Field where CSS text content is stored. 
  - This field value is subsequently used by StoreConeect to produce the css code on the site attached to salesforce. 
  - Ultimately there are many records that hold web code and the scope of this project will manage records an Object, Id and a Field of content
- This extension will associate a web file in vscode such as *.css *.html *.liquid *.js to a salesforce record of an Object, Id and a content Field
- The purpose of this extension is so that a StoreConnect CMS website or Theme can be worked on in VSCode editor and saves to the web project files will updated to the declared salesfooce records on save.
- The usability of this extension will have a "SC-WebDev" click option in the VSCode lower right footer bar that will have the following command pallet shortcut options per project file
  - Set Object, Field and Id (this will declare these parameters for the given file)
  - AuthFolder (an option which authenitcates a direcotry and sun-directoris to a specific salesforce org)
  - Sync On/Off (a toggle which flags the file to be updated with the record in the salesfooce org on save) a green or red icon on the file woul dbe good to display here

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
