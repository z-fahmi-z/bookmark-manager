// Background service worker for the bookmark folder manager extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmark Folder Manager extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Enable side panel for all sites
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    console.log('Side panel connected');
  }
});

// Handle bookmark changes to refresh side panel if needed
chrome.bookmarks.onCreated.addListener(() => {
  // Send message to side panel to refresh
  chrome.runtime.sendMessage({ action: 'bookmarksChanged' });
});

chrome.bookmarks.onRemoved.addListener(() => {
  chrome.runtime.sendMessage({ action: 'bookmarksChanged' });
});

chrome.bookmarks.onChanged.addListener(() => {
  chrome.runtime.sendMessage({ action: 'bookmarksChanged' });
});

chrome.bookmarks.onMoved.addListener(() => {
  chrome.runtime.sendMessage({ action: 'bookmarksChanged' });
});