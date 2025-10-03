// Enhanced n8n AI Assistant - Page Bridge (runs in page context, not content world)
// Provides a messaging bridge to interact with n8n's Pinia stores.
;(function () {
  const CH_REQ = 'ENA_BRIDGE_REQ';
  const CH_RES = 'ENA_BRIDGE_RES';

  function getStores() {
    const w = window;
    // Try recommended globals for n8n
    const workflowsStore = w.workflowsStore || w.useWorkflowsStore?.();
    const nodeTypesStore = w.nodeTypesStore || w.useNodeTypesStore?.();
    const canvasStore = w.canvasStore || w.useCanvasStore?.();
    return { workflowsStore, nodeTypesStore, canvasStore };
  }

  function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
  }

  function exportWorkflowJSONString() {
    const { workflowsStore } = getStores();
    try {
      if (workflowsStore?.getCurrentWorkflow) {
        const wf = workflowsStore.getCurrentWorkflow(true);
        if (wf) return JSON.stringify(wf);
      }
    } catch (e) { console.warn('[ENA] exportWorkflowJSONString error', e); }
    return '';
  }

  async function importWorkflow(data) {
    const { workflowsStore } = getStores();
    if (workflowsStore?.importWorkflow) {
      await workflowsStore.importWorkflow(data);
      return { ok: true };
    }
    return { ok: false, error: 'importWorkflow no disponible' };
  }

  function validateNodeType(nodeTypeName) {
    const { nodeTypesStore } = getStores();
    if (!nodeTypesStore?.getNodeType) return true; // cannot validate, allow
    const t = nodeTypesStore.getNodeType(nodeTypeName);
    return !!t;
  }

  function applyActions(actions) {
    const json = exportWorkflowJSONString();
    const wf = json ? safeParse(json) : { name: 'Workflow', nodes: [], connections: {} };
    if (!wf.nodes) wf.nodes = [];
    if (!wf.connections) wf.connections = {};

    const findNodeById = (id) => wf.nodes.find(n => n.id === id || n.name === id);
    const ensureConnStruct = (sourceName) => {
      if (!wf.connections[sourceName]) wf.connections[sourceName] = {};
      if (!wf.connections[sourceName].main) wf.connections[sourceName].main = [];
      return wf.connections[sourceName];
    };

    for (const step of actions) {
      if (!step || !step.action) continue;
      const act = step.action;
      const data = step.data || {};
      if (act === 'addNode') {
        if (data.type && !validateNodeType(data.type)) {
          throw new Error(`Tipo de nodo desconocido: ${data.type}`);
        }
        // basic defaults
        if (!data.id) data.id = (Math.random().toString(36).slice(2));
        if (!data.position) data.position = [280, 180];
        if (!data.parameters) data.parameters = {};
        if (!data.name) data.name = data.type || `Node_${data.id}`;
        wf.nodes.push(data);
      }
      else if (act === 'updateNodeData') {
        const node = findNodeById(data.id);
        if (!node) throw new Error(`Nodo no encontrado: ${data.id}`);
        Object.assign(node, data.data || {});
      }
      else if (act === 'connectNodes') {
        const { source, target, outputIndex = 0, inputIndex = 0 } = data;
        const srcNode = findNodeById(source);
        const tgtNode = findNodeById(target);
        if (!srcNode || !tgtNode) throw new Error('Source o target no encontrado');
        const srcName = srcNode.name;
        const conn = ensureConnStruct(srcName);
        // Use canal main por defecto
        const main = conn.main;
        while (main.length <= outputIndex) main.push([]);
        main[outputIndex].push({ node: tgtNode.name, type: 'main', index: inputIndex });
      }
      else {
        console.warn('[ENA] Acción no soportada', act);
      }
    }
    return wf;
  }

  async function refreshCanvas() {
    const { canvasStore } = getStores();
    try { canvasStore?.refreshCanvas?.(); } catch {}
  }

  window.addEventListener('message', async (ev) => {
    const msg = ev?.data;
    if (!msg || msg.channel !== CH_REQ) return;
    const { id, cmd, payload } = msg;
    const send = (resp) => window.postMessage({ channel: CH_RES, id, ...resp }, '*');

    try {
      if (cmd === 'ping') {
        const { workflowsStore, nodeTypesStore, canvasStore } = getStores();
        send({ ok: true, data: { hasWorkflows: !!workflowsStore, hasNodeTypes: !!nodeTypesStore, hasCanvas: !!canvasStore } });
      }
      else if (cmd === 'getWorkflow') {
        send({ ok: true, data: exportWorkflowJSONString() });
      }
      else if (cmd === 'importWorkflow') {
        const obj = typeof payload === 'string' ? safeParse(payload) : payload;
        if (!obj) throw new Error('JSON inválido');
        const res = await importWorkflow(obj);
        if (!res.ok) throw new Error(res.error || 'Fallo importWorkflow');
        await refreshCanvas();
        send({ ok: true });
      }
      else if (cmd === 'applyActions') {
        const actions = Array.isArray(payload) ? payload : [];
        const wf = applyActions(actions);
        const res = await importWorkflow(wf);
        if (!res.ok) throw new Error(res.error || 'Fallo import tras acciones');
        await refreshCanvas();
        send({ ok: true });
      }
      else if (cmd === 'refreshCanvas') {
        await refreshCanvas();
        send({ ok: true });
      }
      else {
        send({ ok: false, error: 'Comando no soportado' });
      }
    } catch (e) {
      send({ ok: false, error: e?.message || String(e) });
    }
  });
})();
