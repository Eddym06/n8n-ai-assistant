(function() {
  // Create chat UI
  const chatContainer = document.createElement('div');
  chatContainer.id = 'n8n-ai-assistant';
  chatContainer.innerHTML = `
    <div id="chat-header">AI Assistant</div>
    <div id="chat-messages"></div>
    <div id="chat-input-container">
      <input type="text" id="chat-input" placeholder="Describe your workflow...">
      <button id="chat-submit">Send</button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  // Add styles (loaded via CSS file, but could inline for simplicity)
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = chrome.runtime.getURL('styles.css');
  document.head.appendChild(style);

  // Get DOM elements
  const input = document.getElementById('chat-input');
  const submitButton = document.getElementById('chat-submit');
  const messages = document.getElementById('chat-messages');

  // Store API key (in production, use chrome.storage for security)
  let apiKey = localStorage.getItem('openai_api_key') || prompt('Enter your OpenAI API key:');
  if (apiKey) localStorage.setItem('openai_api_key', apiKey);

  // Function to get current workflow JSON
  function getWorkflowJSON() {
    try {
      // n8n stores workflow data in a global object or Vuex store
      // This is a placeholder; inspect n8n's window or Vue instance for exact path
      const workflowData = window?.n8n?.workflowData || window?.__NUXT__?.state?.workflow;
      return JSON.stringify(workflowData || {});
    } catch (e) {
      console.error('Error getting workflow JSON:', e);
      return '{}';
    }
  }

  // Function to apply workflow JSON to n8n
  function applyWorkflowJSON(json) {
    try {
      // Simulate n8n's import functionality
      const parsed = JSON.parse(json);
      // Trigger n8n's internal import (inspect n8n source for exact method)
      // Placeholder: assumes n8n has a global method to import JSON
      if (window.n8n?.importWorkflow) {
        window.n8n.importWorkflow(parsed);
      } else {
        // Fallback: use clipboard to paste JSON
        navigator.clipboard.writeText(json).then(() => {
          // Trigger paste event or click import button in n8n UI
          const importButton = document.querySelector('.n8n-import-button');
          if (importButton) importButton.click();
        });
      }
      addMessage('System', 'Workflow applied successfully!');
    } catch (e) {
      console.error('Error applying workflow:', e);
      addMessage('System', 'Error applying workflow: ' + e.message);
    }
  }

  // Function to call OpenAI API
  async function callAI(prompt) {
    const workflow = getWorkflowJSON();
    const fullPrompt = `You are an expert in n8n workflows. Current workflow: ${workflow}. Based on this, ${prompt}. Return only the modified or new workflow JSON.`;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: fullPrompt }],
          max_tokens: 2000
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0].message.content) {
        return data.choices[0].message.content;
      }
      throw new Error('No valid response from AI');
    } catch (e) {
      console.error('AI API error:', e);
      addMessage('System', 'Error calling AI: ' + e.message);
      return null;
    }
  }

  // Function to add message to chat
  function addMessage(sender, text) {
    const message = document.createElement('div');
    message.className = 'chat-message';
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  // Handle submit button
  submitButton.addEventListener('click', async () => {
    const prompt = input.value.trim();
    if (!prompt) return;
    
    addMessage('You', prompt);
    input.value = '';

    const aiResponse = await callAI(prompt);
    if (aiResponse) {
      addMessage('AI', 'Generated workflow JSON. Applying...');
      applyWorkflowJSON(aiResponse);
    }
  });

  // Handle Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitButton.click();
  });
})();