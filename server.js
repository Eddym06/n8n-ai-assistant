// Simple Node server for LLM proxy and optional git operations
// Run: node server.js  (requires: npm i express node-fetch@3)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.post('/api/llm', async (req, res) => {
  try {
    const { provider, apiKey, model, prompt } = req.body || {};
    if (!provider || !apiKey || !prompt) return res.status(400).json({ error: 'missing fields' });
    if (provider === 'openai') {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({ model: model || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] })
      });
      return res.status(r.status).json(await r.json());
    }
    if (provider === 'gemini') {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
      return res.status(r.status).json(await r.json());
    }
    if (provider === 'grok') {
      const r = await fetch('https://api.x.ai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey }, body: JSON.stringify({ model: model || 'grok-beta', messages: [{ role: 'user', content: prompt }] }) });
      return res.status(r.status).json(await r.json());
    }
    return res.status(400).json({ error: 'unsupported provider' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/git/export', async (req, res) => {
  try {
    const { token, owner, repo, path, message, contentBase64 } = req.body || {};
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT', headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: contentBase64 })
    });
    res.status(r.status).json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log('Server listening on http://localhost:' + port));
