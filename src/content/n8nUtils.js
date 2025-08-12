const CH_REQ = 'ENA_BRIDGE_REQ';
const CH_RES = 'ENA_BRIDGE_RES';

function request(cmd, payload) {
  return new Promise((resolve) => {
    const id = Math.random().toString(36).slice(2);
    const handler = (ev) => {
      const msg = ev?.data;
      if (!msg || msg.channel !== CH_RES || msg.id !== id) return;
      window.removeEventListener('message', handler);
      resolve(msg);
    };
    window.addEventListener('message', handler);
    window.postMessage({ channel: CH_REQ, id, cmd, payload }, '*');
  });
}

export async function pingStores() {
  return request('ping');
}

export async function getWorkflowJSON() {
  const res = await request('getWorkflow');
  if (res.ok) return res.data || '';
  return '';
}

export async function importWorkflowJSON(json) {
  return request('importWorkflow', json);
}

export async function applyActions(actions) {
  return request('applyActions', actions);
}

export async function refreshCanvas() {
  return request('refreshCanvas');
}

// Error detection utilities
export function observeN8nErrors(callback) {
  const sel = '.n8n-error-message, .el-notification__content, .el-message__content';
  const emit = () => {
    const nodes = Array.from(document.querySelectorAll(sel));
    const text = nodes.map(n => n.textContent?.trim()).filter(Boolean).join('\n');
    if (text) callback(text);
  };
  const mo = new MutationObserver(() => emit());
  mo.observe(document.body, { childList: true, subtree: true });
  emit();
  return () => mo.disconnect();
}

export async function notify(title, message) {
  try {
    chrome.runtime.sendMessage({ type: 'notify', title, message });
  } catch {}
}

export function startVoiceRecognition(onText) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = 'es-ES';
  rec.interimResults = true;
  rec.onresult = (e) => {
    const t = Array.from(e.results).map(r => r[0].transcript).join(' ');
    onText(t, e.results[e.results.length - 1].isFinal);
  };
  rec.start();
  return rec;
}

// Placeholder: export workflow to GitHub using user token (to be wired from popup)
export async function exportWorkflowToGitHub({ owner, repo, path, contentBase64, token, message }) {
  const res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + path, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, content: contentBase64 })
  });
  return res.json();
}
