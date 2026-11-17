/*
 * Tiny component runtime for Julianna Tatar's portfolio.
 * Each page section is an HTML <template id="tpl-Name"> plus a class that
 * extends DCLogic and returns the values its template uses ({{holes}}).
 * Template tags:  <sc-if value="{{x}}">, <sc-for list="{{xs}}" as="item">,
 *                 <dc-import name="Child" some-prop="...">
 * No libraries needed; works by opening index.html in a browser.
 */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      const p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, p);
      scheduleUpdate();
    }
    forceUpdate() { scheduleUpdate(); }
    renderVals() { return {}; }
  }
  window.DCLogic = DCLogic;

  const registry = {};          // name -> class
  window.registerComponent = function (name, cls) { registry[name] = cls; };

  // ---------- holes ----------
  const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const ANY = /\{\{\s*([^}]+?)\s*\}\}/g;

  function lookup(path, scope) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    let v = scope;
    for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; }
    return v;
  }
  function textOf(v) {
    return (v === null || v === undefined || v === false || v === true) ? '' : String(v);
  }
  function interpolate(str, scope) {
    return str.replace(ANY, (_, p) => textOf(lookup(p, scope)));
  }
  const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  // ---------- rendering ----------
  const instances = new Map();  // key -> component instance

  function renderComponent(name, props, key, out) {
    const Cls = registry[name];
    const tpl = document.getElementById('tpl-' + name);
    if (!Cls || !tpl) { console.warn('Missing component', name); return; }
    let inst = instances.get(key);
    if (!inst || inst.constructor !== Cls) { inst = new Cls(props); instances.set(key, inst); }
    else inst.props = props;
    const scope = inst.renderVals() || {};
    renderChildren(tpl.content.childNodes, scope, key, out);
  }

  function renderChildren(nodes, scope, key, out) {
    let i = 0;
    for (const n of nodes) { renderNode(n, scope, key + '.' + (i++), out); }
  }

  function renderNode(n, scope, key, out) {
    if (n.nodeType === 3) {
      out.push(document.createTextNode(n.nodeValue.indexOf('{{') < 0 ? n.nodeValue : interpolate(n.nodeValue, scope)));
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = n.localName;

    if (tag === 'sc-if') {
      const m = (n.getAttribute('value') || '').match(WHOLE);
      if (m && lookup(m[1], scope)) renderChildren(n.childNodes, scope, key, out);
      return;
    }
    if (tag === 'sc-for') {
      const m = (n.getAttribute('list') || '').match(WHOLE);
      const list = m ? lookup(m[1], scope) : null;
      const as = n.getAttribute('as') || 'item';
      (Array.isArray(list) ? list : []).forEach((item, idx) => {
        const s = Object.create(scope); s[as] = item; s.$index = idx;
        renderChildren(n.childNodes, s, key + '[' + idx + ']', out);
      });
      return;
    }
    if (tag === 'dc-import') {
      const props = {};
      let name = '';
      for (const a of n.attributes) {
        if (a.name === 'name') { name = a.value; continue; }
        if (a.name.startsWith('hint-')) continue;
        const m = a.value.match(WHOLE);
        props[camel(a.name)] = m ? lookup(m[1], scope) : (a.value.indexOf('{{') < 0 ? a.value : interpolate(a.value, scope));
      }
      renderComponent(name, props, key + ':' + name, out);
      return;
    }

    const el = n.cloneNode(false);               // keeps SVG namespaces
    const handlers = {};
    for (const a of Array.from(n.attributes)) {
      const nm = a.name;
      if (nm.startsWith('on')) {                 // onClick="{{fn}}" -> real listener
        el.removeAttribute(nm);
        const m = a.value.match(WHOLE);
        const fn = m ? lookup(m[1], scope) : null;
        if (typeof fn === 'function') handlers[nm.slice(2).toLowerCase()] = fn;
        continue;
      }
      if (a.value.indexOf('{{') < 0) continue;
      const m = a.value.match(WHOLE);
      if (m) {
        const v = lookup(m[1], scope);
        if (v === false || v === null || v === undefined) {
          if (nm.startsWith('aria-') && v === false) el.setAttribute(nm, 'false'); else el.removeAttribute(nm);
        } else if (v === true) {
          el.setAttribute(nm, (nm.startsWith('aria-') || nm.startsWith('data-')) ? 'true' : '');
        } else el.setAttribute(nm, String(v));
      } else {
        el.setAttribute(nm, interpolate(a.value, scope));
      }
    }
    el.__handlers = handlers;
    const kids = [];
    renderChildren(n.childNodes, scope, key, kids);
    for (const k of kids) el.appendChild(k);
    out.push(el);
  }

  // ---------- patching the live page (keeps elements so transitions animate) ----------
  function bindHandlers(live, next) {
    const h = next.__handlers || {};
    live.__handlers = h;
    if (!live.__bound) {
      live.__bound = true;
      for (const t of ['click', 'input', 'change', 'keydown', 'submit', 'mouseenter', 'mouseleave', 'focus', 'blur']) {
        live.addEventListener(t, function (e) { const f = live.__handlers && live.__handlers[t]; if (f) f(e); });
      }
    }
  }
  function prepare(node) {           // bind handlers on a freshly inserted subtree
    if (node.nodeType !== 1) return node;
    bindHandlers(node, node);
    for (const c of node.childNodes) prepare(c);
    return node;
  }
  function morph(live, next) {
    if (live.nodeType !== next.nodeType || live.nodeName !== next.nodeName || live.namespaceURI !== next.namespaceURI) {
      live.parentNode.replaceChild(prepare(next), live);
      return;
    }
    if (live.nodeType === 3) { if (live.nodeValue !== next.nodeValue) live.nodeValue = next.nodeValue; return; }
    for (const a of Array.from(live.attributes)) if (!next.hasAttribute(a.name)) live.removeAttribute(a.name);
    for (const a of Array.from(next.attributes)) if (live.getAttribute(a.name) !== a.value) live.setAttribute(a.name, a.value);
    if ('disabled' in live) live.disabled = next.hasAttribute('disabled');
    bindHandlers(live, next);
    morphChildren(live, Array.from(next.childNodes));
  }
  function morphChildren(parent, nextKids) {
    const liveKids = Array.from(parent.childNodes);
    const n = Math.max(liveKids.length, nextKids.length);
    for (let i = 0; i < n; i++) {
      const l = liveKids[i], x = nextKids[i];
      if (!l) parent.appendChild(prepare(x));
      else if (!x) parent.removeChild(l);
      else morph(l, x);
    }
  }

  let root = null, rootName = '', queued = false;
  function update() {
    queued = false;
    const out = [];
    renderComponent(rootName, {}, 'root', out);
    morphChildren(root, out);
  }
  function scheduleUpdate() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  window.mountSite = function (name, el) { rootName = name; root = el; update(); };
})();
