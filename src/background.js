// Background Service Worker: relays notifications and optional proxy logic
chrome.runtime.onInstalled.addListener(() => {
  console.log('Enhanced n8n AI Assistant installed');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'notify' && msg?.title) {
    chrome.notifications?.create?.({
      type: 'basic',
      title: msg.title,
      message: msg.message || '',
      iconUrl: 'icons/icon128.png'
    });
    sendResponse?.({ ok: true });
    return true;
  }
});
