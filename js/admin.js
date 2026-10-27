// js/admin.js — Panel de administración (alta, edición y baja). La seguridad real está en el backend
// (api/[col].js valida el token); este archivo solo es la interfaz.
import { renderLayout } from './layout.js';
import { h, api } from './utils.js';

renderLayout();

// ---- Definición de formularios: para agregar un campo nuevo, añadirlo aquí y en api/[col].js ----
const COLS = {
  items: { label: 'Convocatorias, proyectos y eventos', title: 'titulo', fields: [
    ['tipo', 'Tipo', 'select', ['convocatoria', 'proyecto', 'evento']], ['estatus', 'Estatus', 'select', ['publicado', 'borrador']],
    ['titulo', 'Título', 'text'], ['fecha', 'Fecha', 'date'], ['carrera', 'Carrera / área', 'text'], ['responsable', 'Responsable', 'text'],
    ['imagen', 'URL de imagen', 'url'], ['enlace', 'URL de enlace', 'url'], ['descripcion', 'Descripción', 'textarea']] },
  gallery: { label: 'Galería', title: 'alt', fields: [['url', 'URL de la foto', 'url'], ['alt', 'Descripción de la foto', 'text'], ['orden', 'Orden', 'number']] },
};
let token = sessionStorage.getItem('tok'), col = 'items', editId = null;
const $ = (id) => document.getElementById(id), say = (t, ok = true) => { $('amsg').textContent = t; $('amsg').className = 'text-sm mt-3 ' + (ok ? 'text-green-700' : 'text-red-700'); };

function show() { $('login').hidden = !!token; $('panel').hidden = !token; if (token) { tabs(); load(); } }

$('login').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { token = (await api('login', { method: 'POST', body: { password: $('pw').value } })).token; sessionStorage.setItem('tok', token); $('pw').value = ''; show(); }
  catch (err) { $('lerr').textContent = err.message; }
});
$('logout').addEventListener('click', () => { sessionStorage.removeItem('tok'); token = null; show(); });

function tabs() { $('atabs').replaceChildren(...Object.entries(COLS).map(([k, c]) => h('button', { class: 'btn' + (k === col ? ' !bg-guinda' : ''), onclick: () => { col = k; editId = null; tabs(); load(); } }, c.label))); form(); }

function form(data = {}) {
  const f = $('aform');
  f.replaceChildren(...COLS[col].fields.map(([n, l, t, opts]) => h('label', { class: 'text-sm font-medium' + (t === 'textarea' ? ' sm:col-span-2' : '') }, l,
    t === 'select' ? h('select', { name: n, class: 'mt-1 w-full border rounded p-2' }, opts.map((o) => h('option', { value: o, selected: data[n] === o }, o)))
    : t === 'textarea' ? h('textarea', { name: n, rows: 4, class: 'mt-1 w-full border rounded p-2' }, data[n] || '')
    : h('input', { name: n, type: t, value: data[n] ?? '', required: n === 'titulo' || n === 'url', class: 'mt-1 w-full border rounded p-2' }))),
    h('button', { class: 'btn sm:col-span-2' }, editId ? 'Guardar cambios' : 'Agregar'));
}
$('aform').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api(col + (editId ? '?id=' + editId : ''), { method: editId ? 'PUT' : 'POST', token, body: Object.fromEntries(new FormData(e.currentTarget)) });
    say(editId ? 'Cambios guardados' : 'Agregado'); editId = null; form(); load();
  } catch (err) { say(err.message, false); if (/Sesión/.test(err.message)) $('logout').click(); }
});

async function load() {
  const rows = await api(col + (col === 'items' ? '?all=1' : ''), { token });
  $('alist').replaceChildren(...rows.map((r) => h('li', { class: 'card p-3 flex items-center justify-between gap-3' },
    h('span', {}, h('b', {}, r[COLS[col].title] || '(sin título)'), r.tipo ? ` — ${r.tipo} (${r.estatus})` : ''),
    h('span', { class: 'flex gap-3 text-sm' },
      h('button', { class: 'underline text-azul', onclick: () => { editId = r._id; form(r); scrollTo(0, 0); } }, 'Editar'),
      h('button', { class: 'underline text-guinda', onclick: async () => { if (confirm('¿Eliminar definitivamente?')) { await api(`${col}?id=${r._id}`, { method: 'DELETE', token }); load(); } } }, 'Eliminar')))));
}
show();
