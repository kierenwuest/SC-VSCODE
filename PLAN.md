# SC-VSC-WebDev

A VSCode extension tailored specifically to enhance the development workflow for StoreConnect CMS themes and website components. This extension will effectively bridge the gap between local development and Salesforce data management by synchronizing changes in VSCode directly to Salesforce records. Below, I'll outline some key technical considerations and steps to get started with building this extension.

### Key Technical Considerations:

1. **Authentication**: Managing Salesforce authentication securely, especially when working with multiple environments (e.g., development, staging, production).

2. **Mapping Files to Salesforce Records**: The ability to configure and store mappings between local files and Salesforce records (Object, Id, Field).

3. **Real-Time Synchronization**: Listening for file save events and updating the corresponding Salesforce record immediately.

4. **User Interface in VSCode**: Creating a user-friendly interface within VSCode, including clickable options in the footer bar, command palette actions, and indicators (e.g., icons) for sync status.

5. **Configuration and State Management**: Handling settings for each project, such as authentication for directories, toggling sync on/off, and maintaining these settings persistently.

### Steps to Develop the Extension:

#### Done ! Step 1: Setup Your Development Environment
- Install **Node.js** and **npm**.
- Install **Yeoman** and the **VSCode Extension Generator** to scaffold your project:
  ```bash
  npm install -g yo generator-code
  ```
- Run `yo code` to create your extension structure.
- What type of extension do you want to create? New Extension (TypeScript)
- What's the name of your extension? StoreConnect VSC WebDev
- What's the identifier of your extension? sc-vsc-webdev
- Initialize a git repository? NoOk next sep
- Bundle the source code with webpack? Yes
- Which package manager to use? npm



#### Step 2: Define Extension Capabilities
- Implement the logic to **authenticate** with Salesforce, possibly using OAuth and storing tokens securely using VSCode's secrets API.
- Create a **configuration storage mechanism** in VSCode to store mappings between files and Salesforce records.
- Use the **VSCode API** to add UI elements in the footer bar and to handle file events.
When implementing OAuth in your VSCode extension, ensure you handle the authentication flow securely, possibly opening a browser for the user to log in and capturing the redirect URI through a local server. Store tokens securely using the VSCode secrets API to maintain user data security.

Consumer Key	
`3MVG929eOx29turFQ0fXnYkUTlvZxTNM0iGjQOdLAhdGQLo92.w4snZRv12FP6jejeY11NxhdX7hXndaab0ac`   
Consumer Secret	
`E53D60D015FE1C4DA44B4BA6382FDA866F76151A6A00550BDBC4EC65B690E6DD`

This setup will provide your extension with the necessary permissions to update records in Salesforce while keeping the security and usability in focus.

#### Step 3: Implement Command Palette Actions
- **Set Object, Field, and Id**: This command will open a UI form or input box to set or update mappings for the current file.
- **AuthFolder**: Implement a command to authenticate a directory, storing OAuth tokens or session IDs securely.
- **Sync On/Off**: Toggle synchronization settings, with visual feedback (icons) on the file tabs.

#### Step 4: Handling File Events
- Use `workspace.onDidSaveTextDocument` from the VSCode API to capture file saves and then execute the sync process if enabled.

#### Step 5: Interact with Salesforce
- Implement functions using the Salesforce REST API to update records based on the content in local files. Ensure error handling is robust to manage API limits and authentication issues.

#### Step 6: Testing and Debugging
- Test the extension in various scenarios to ensure it handles different file types, respects user settings, manages Salesforce limits gracefully, and updates records accurately.
- Consider edge cases, such as large files, network failures, and Salesforce downtime.

#### Step 7: Packaging and Distribution
- Package the extension using VSCode's packaging tools.
- Publish the extension to the VSCode Marketplace or distribute it internally within your organization.

### Security and Performance Considerations:
- Ensure all data transmissions to and from Salesforce are encrypted.
- Manage API rate limits and optimize API calls to avoid exceeding Salesforce limits.
- Securely handle authentication data, possibly using environment variables or encrypted storage.

This plan provides a structured approach to building your VSCode extension for StoreConnect, enhancing the development experience by integrating directly with Salesforce CMS capabilities. If you have any more specific questions or need further details on any of the steps, feel free to ask!
