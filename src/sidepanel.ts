// Side panel TypeScript code for bookmark folder management

interface BookmarkTreeNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkTreeNode[];
  parentId?: string;
  index?: number;
}

class BookmarkFolderManager {
  private container: HTMLElement;
  private searchInput: HTMLInputElement;

  constructor() {
    this.container = document.getElementById('bookmark-folders') as HTMLElement;
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadBookmarkFolders();
    this.setupEventListeners();
    this.setupMessageListener();
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase();
      this.filterFolders(query);
    });

    // Add new folder button
    const addFolderBtn = document.getElementById('add-folder-btn');
    addFolderBtn?.addEventListener('click', () => this.showAddFolderDialog());
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'bookmarksChanged') {
        this.loadBookmarkFolders();
      }
    });
  }

  private async loadBookmarkFolders(): Promise<void> {
    try {
      const bookmarkTree = await chrome.bookmarks.getTree();
      const folders = this.extractFolders(bookmarkTree);
      this.renderFolders(folders);
    } catch (error) {
      console.error('Error loading bookmark folders:', error);
      this.container.innerHTML = '<div class="error">Error loading bookmarks</div>';
    }
  }

  private extractFolders(nodes: BookmarkTreeNode[]): BookmarkTreeNode[] {
    const folders: BookmarkTreeNode[] = [];
    
    const traverse = (node: BookmarkTreeNode, level: number = 0) => {
      if (!node.url && node.children) { // It's a folder
        folders.push({ ...node, level } as any);
        node.children.forEach(child => traverse(child, level + 1));
      }
    };

    nodes.forEach(node => traverse(node));
    return folders.filter(folder => folder.title && folder.title !== ''); // Filter out root nodes
  }

  private renderFolders(folders: BookmarkTreeNode[]): void {
    if (folders.length === 0) {
      this.container.innerHTML = '<div class="no-folders">No bookmark folders found</div>';
      return;
    }

    const html = folders.map(folder => this.createFolderHTML(folder)).join('');
    this.container.innerHTML = html;

    // Add event listeners for folder actions
    this.attachFolderEventListeners();
  }

  private createFolderHTML(folder: BookmarkTreeNode & { level?: number }): string {
    const level = folder.level || 0;
    const indent = level * 20;
    const childCount = folder.children ? folder.children.filter(child => !child.url).length : 0;
    const bookmarkCount = folder.children ? folder.children.filter(child => child.url).length : 0;

    return `
      <div class="folder-item" data-folder-id="${folder.id}" style="margin-left: ${indent}px">
        <div class="folder-header">
          <div class="folder-info">
            <span class="folder-icon">📁</span>
            <span class="folder-name" title="${folder.title}">${folder.title}</span>
            <span class="folder-stats">
              ${childCount > 0 ? `${childCount} folders, ` : ''}${bookmarkCount} bookmarks
            </span>
          </div>
          <div class="folder-actions">
            <button class="action-btn rename-btn" data-folder-id="${folder.id}" title="Rename">
              ✏️
            </button>
            <button class="action-btn delete-btn" data-folder-id="${folder.id}" title="Delete">
              🗑️
            </button>
            <button class="action-btn open-btn" data-folder-id="${folder.id}" title="Open all bookmarks">
              🔗
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private attachFolderEventListeners(): void {
    // Rename buttons
    document.querySelectorAll('.rename-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = (e.target as HTMLElement).dataset.folderId!;
        this.renameFolder(folderId);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = (e.target as HTMLElement).dataset.folderId!;
        this.deleteFolder(folderId);
      });
    });

    // Open all buttons
    document.querySelectorAll('.open-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = (e.target as HTMLElement).dataset.folderId!;
        this.openAllBookmarks(folderId);
      });
    });

    // Folder click to show details
    document.querySelectorAll('.folder-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).classList.contains('action-btn')) {
          const folderId = (e.currentTarget as HTMLElement).dataset.folderId!;
          this.showFolderDetails(folderId);
        }
      });
    });
  }

  private async renameFolder(folderId: string): Promise<void> {
    try {
      const folder = (await chrome.bookmarks.get(folderId))[0];
      const newName = prompt('Enter new folder name:', folder.title);
      
      if (newName && newName.trim() !== '' && newName !== folder.title) {
        await chrome.bookmarks.update(folderId, { title: newName.trim() });
        this.loadBookmarkFolders();
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
      alert('Error renaming folder');
    }
  }

  private async deleteFolder(folderId: string): Promise<void> {
    try {
      const folder = (await chrome.bookmarks.get(folderId))[0];
      
      if (confirm(`Are you sure you want to delete "${folder.title}" and all its contents?`)) {
        await chrome.bookmarks.removeTree(folderId);
        this.loadBookmarkFolders();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Error deleting folder');
    }
  }

  private async openAllBookmarks(folderId: string): Promise<void> {
    try {
      const children = await chrome.bookmarks.getChildren(folderId);
      const bookmarks = children.filter(child => child.url);
      
      if (bookmarks.length === 0) {
        alert('No bookmarks found in this folder');
        return;
      }

      if (bookmarks.length > 10 && !confirm(`This will open ${bookmarks.length} bookmarks. Continue?`)) {
        return;
      }

      bookmarks.forEach(bookmark => {
        if (bookmark.url) {
          chrome.tabs.create({ url: bookmark.url, active: false });
        }
      });
    } catch (error) {
      console.error('Error opening bookmarks:', error);
      alert('Error opening bookmarks');
    }
  }

  private async showFolderDetails(folderId: string): Promise<void> {
    try {
      const children = await chrome.bookmarks.getChildren(folderId);
      const folder = (await chrome.bookmarks.get(folderId))[0];
      
      const bookmarks = children.filter(child => child.url);
      const subfolders = children.filter(child => !child.url);

      const details = `
        <h3>${folder.title}</h3>
        <p><strong>Subfolders:</strong> ${subfolders.length}</p>
        <p><strong>Bookmarks:</strong> ${bookmarks.length}</p>
        ${bookmarks.length > 0 ? '<h4>Recent bookmarks:</h4><ul>' + 
          bookmarks.slice(0, 5).map(b => `<li><a href="${b.url}" target="_blank">${b.title}</a></li>`).join('') + 
          (bookmarks.length > 5 ? `<li>... and ${bookmarks.length - 5} more</li>` : '') + '</ul>' : ''}
      `;

      const detailsPanel = document.getElementById('folder-details');
      if (detailsPanel) {
        detailsPanel.innerHTML = details;
        detailsPanel.style.display = 'block';
      }
    } catch (error) {
      console.error('Error showing folder details:', error);
    }
  }

  private async showAddFolderDialog(): Promise<void> {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim() !== '') {
      try {
        // Get the bookmarks bar (usually id "1")
        const bookmarksBar = await chrome.bookmarks.get('1');
        await chrome.bookmarks.create({
          parentId: bookmarksBar[0].id,
          title: folderName.trim()
        });
        this.loadBookmarkFolders();
      } catch (error) {
        console.error('Error creating folder:', error);
        alert('Error creating folder');
      }
    }
  }

  private filterFolders(query: string): void {
    const folderItems = document.querySelectorAll('.folder-item');
    
    folderItems.forEach(item => {
      const folderName = item.querySelector('.folder-name')?.textContent?.toLowerCase() || '';
      const shouldShow = folderName.includes(query);
      (item as HTMLElement).style.display = shouldShow ? 'block' : 'none';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookmarkFolderManager();
});