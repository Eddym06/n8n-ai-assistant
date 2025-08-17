import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/tailwind.css';

function Popup() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['llmProvider', 'model'], (res) => {
      if (res.llmProvider) setProvider(res.llmProvider);
      if (res.model) setModel(res.model);
    });
  }, []);

  const openOptions = () => {
    try {
      chrome.runtime.openOptionsPage();
    } catch (e) {
      console.error('Error opening options:', e);
    }
  };

  const activateAssistant = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;
      
      await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE_ASSISTANT' }).catch(() => {
        // If content script not loaded, inject it
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['assets/content.js']
        });
      });
    } catch (e) {
      console.error('Error activating assistant:', e);
    }
  };

  return (
    <div className="w-80 p-4 bg-white">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-2">n8n AI Assistant</h1>
        <p className="text-sm text-gray-600">
          Provider: {provider} {model && `(${model})`}
        </p>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={activateAssistant}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Activate Assistant
        </button>
        
        <button 
          onClick={openOptions}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Settings
        </button>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click "Activate Assistant" to enable AI help on this page.
        </p>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<Popup />);
