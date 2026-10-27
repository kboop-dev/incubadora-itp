// js/utils.js — Helpers compartidos. IMPORTANTE (seguridad): todo contenido de la BD se inserta
// con h() (nodos de texto), NUNCA con innerHTML, para evitar XSS.
export const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v != null && v !== false) el.setAttribute(k, v);
  }
  el.append(...kids.flat().filter((x) => x != null));
  return el;
};
// Solo permite enlaces http(s); bloquea "javascript:" y similares.
export const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '#');

export async function api(path, { method = 'GET', body, token } = {}) {
  const r = await fetch('/api/' + path, {
    method, body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Error ' + r.status);
  return d;
}
