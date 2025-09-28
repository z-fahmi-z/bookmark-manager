# Bookmark Folder Manager Chrome Extension

A Chrome extension built with TypeScript that displays all bookmark folders in a convenient side panel for better bookmark management.

## 🌟 Features

- **Side Panel Display**: View all bookmark folders in a dedicated side panel
- **Hierarchical View**: Shows folder structure with proper indentation
- **Search Functionality**: Quickly find specific folders
- **Folder Management**: 
  - Rename folders
  - Delete folders (with confirmation)
  - Create new folders
  - Open all bookmarks in a folder
- **Real-time Updates**: Automatically refreshes when bookmarks change
- **Folder Statistics**: Shows count of subfolders and bookmarks
- **Clean UI**: Modern, responsive design

## 📁 Project Structure

```
bookmark-folder-manager/
├── src/
│   ├── background.ts          # Service worker
│   └── sidepanel.ts          # Side panel functionality
├── icons/                    # Extension icons (auto-generated)
├── dist/                     # Compiled JavaScript (generated)
├── manifest.json            # Extension manifest
├── sidepanel.html          # Side panel HTML
├── tsconfig.json           # TypeScript configuration
├── package.json            # Node.js dependencies
├── build.sh               # Build script
└── README.md             # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm
- Google Chrome

### Local Development

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   chmod +x build.sh
   ./build.sh
   ```

   Or manually:
   ```bash
   npx tsc
   ```

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the project folder

## 🚀 Usage

1. **Open Side Panel**: Click the extension icon in the toolbar
2. **Browse Folders**: View all bookmark folders with their hierarchy
3. **Search**: Use the search bar to filter folders by name
4. **Manage Folders**:
   - **Rename**: Click the ✏️ icon next to any folder
   - **Delete**: Click the 🗑️ icon (with confirmation)
   - **Open All**: Click the 🔗 icon to open all bookmarks in a folder
   - **Add New**: Click the "➕ Add New Folder" button

## 🔧 Development

### File Descriptions

- **`manifest.json`**: Extension configuration and permissions
- **`src/background.ts`**: Service worker handling extension lifecycle and bookmark events
- **`src/sidepanel.ts`**: Main side panel logic with TypeScript classes and interfaces
- **`sidepanel.html`**: Side panel UI with embedded CSS
- **`tsconfig.json`**: TypeScript compiler configuration
- **`build.sh`**: Automated build script

### Key Features Implementation

- **Bookmark API Integration**: Uses Chrome's `chrome.bookmarks` API
- **Side Panel API**: Leverages Chrome's `chrome.sidePanel` API
- **Real-time Updates**: Listens to bookmark change events
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Error Handling**: Comprehensive error handling and user feedback

### Permissions Used

- `bookmarks`: Access to bookmark data
- `sidePanel`: Display content in Chrome's side panel

## 🎨 Customization

The extension uses a clean, modern design with:
- GitHub-inspired color scheme
- Responsive hover effects
- Smooth animations
- Hierarchical indentation for folder structure

You can customize the appearance by modifying the CSS in `sidepanel.html`.

## 🐛 Troubleshooting

### Common Issues

1. **Extension not loading**: 
   - Ensure you've run the build script
   - Check that all files are present
   - Verify Developer Mode is enabled

2. **TypeScript errors**:
   - Make sure you have the correct Node.js version
   - Run `npm install` to ensure dependencies are installed

3. **Side panel not opening**:
   - Try refreshing the extension in chrome://extensions/
   - Check the background script console for errors

4. **Bookmarks not displaying**:
   - Verify the extension has bookmark permissions
   - Check if you have any bookmark folders created
   - Open browser console in the side panel to check for errors

### Development Tips

- Use `chrome://extensions/` to reload the extension after changes
- Enable "Inspect views: side panel" to debug the side panel
- Check the service worker console for background script debugging
- Use TypeScript's strict mode for better code quality

## 📝 Code Examples

### Adding a Custom Action

To add a new folder action, modify the `createFolderHTML` method in `src/sidepanel.ts`:

```typescript
// Add to the folder-actions div
<button class="action-btn custom-btn" data-folder-id="${folder.id}" title="Custom Action">
  ⭐
</button>
```

Then add the event listener in `attachFolderEventListeners()`:

```typescript
document.querySelectorAll('.custom-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const folderId = (e.target as HTMLElement).dataset.folderId!;
    this.customAction(folderId);
  });
});
```

### Extending the Bookmark Interface

```typescript
interface ExtendedBookmarkNode extends BookmarkTreeNode {
  level?: number;
  bookmarkCount?: number;
  folderCount?: number;
  lastModified?: number;
}
```

## 🔄 Build Process

The build process involves:

1. **TypeScript Compilation**: Converts `.ts` files to `.js` in the `dist/` folder
2. **Icon Generation**: Creates placeholder icons (replace with actual icons for production)
3. **Manifest Validation**: Ensures all required files are referenced correctly

## 📦 Production Build

For a production build:

1. Replace placeholder icons with actual extension icons
2. Minify the JavaScript files if needed
3. Test thoroughly across different Chrome versions
4. Consider adding error reporting for production use

## 🚀 Publishing

To publish to the Chrome Web Store:

1. Create a developer account at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. Replace placeholder icons with high-quality icons
3. Add detailed description and screenshots
4. Package the extension as a ZIP file
5. Upload and submit for review

## 📄 License

This project is provided as-is for educational and development purposes. Feel free to modify and use according to your needs.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Note**: This extension requires Chrome's Side Panel API, which is available in Chrome 114+. For older versions, consider using a popup interface instead.