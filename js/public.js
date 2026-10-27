// js/public.js — Vista pública: galería, tarjetas por pestaña y formulario de contacto.
import { CONFIG as C } from './config.js';
import { renderLayout } from './layout.js';
import { h, api, safeUrl } from './utils.js';

renderLayout();

/* 1. Galería: fotos de la BD; si no hay, las de CONFIG.GALERIA; si tampoco, recuadros vacíos. */
async function loadGallery() {
  const box = document.getElementById('carousel');
  let fotos = [];
  try { fotos = await api('gallery'); } catch (e) { console.error('Galería:', e); }
  if (!fotos.length) fotos = C.GALERIA;
  box.replaceChildren(...(fotos.length
    ? fotos.map((f) => h('img', { src: safeUrl(f.url), alt: f.alt || 'Foto de la incubadora', loading: 'lazy', class: 'h-64 w-full object-cover rounded-lg shadow' }))
    : [1, 2, 3].map(() => h('div', { class: 'ph' }, 'Foto próximamente'))));
}
for (const [id, dir] of [['prev', -1], ['next', 1]])
  document.getElementById(id).addEventListener('click', () => { const c = document.getElementById('carousel'); c.scrollBy({ left: dir * c.clientWidth * 0.8 }); });

/* 2. Tarjetas por pestaña (cada pestaña pide a la API solo su tipo) */
const TABS = [['convocatoria', 'Convocatorias', 'convocatorias'], ['proyecto', 'Proyectos incubados', 'proyectos incubados'], ['evento', 'Eventos', 'eventos']];
const card = (i) => h('article', { class: 'card overflow-hidden flex flex-col' },
  i.imagen ? h('img', { src: safeUrl(i.imagen), alt: '', loading: 'lazy', class: 'h-40 w-full object-cover' }) : null,
  h('div', { class: 'p-5 flex-1 flex flex-col' },
    h('div', { class: 'flex items-center justify-between gap-2' }, h('span', { class: 'chip' }, i.carrera || i.tipo), h('span', { class: 'text-xs text-slate-500' }, i.fecha || '')),
    h('h3', { class: 'font-bold text-azul text-lg mt-3' }, i.titulo),
    h('p', { class: 'text-sm text-slate-600 mt-2 flex-1' }, i.descripcion),
    i.responsable ? h('p', { class: 'text-xs text-slate-500 mt-3' }, 'Responsable: ' + i.responsable) : null,
    i.enlace ? h('a', { href: safeUrl(i.enlace), class: 'btn mt-4 text-center', target: '_blank', rel: 'noopener' }, 'Ver más') : null));

async function showTab(tipo, plural) {
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === tipo)));
  const grid = document.getElementById('grid');
  grid.replaceChildren(h('p', { class: 'text-slate-500' }, 'Cargando…'));
  try {
    const items = await api('items?tipo=' + tipo);
    grid.replaceChildren(...(items.length ? items.map(card) : [h('p', { class: 'text-slate-500' }, `Aún no hay ${plural} publicados.`)]));
  } catch (e) { console.error('Tarjetas:', e); grid.replaceChildren(h('p', { class: 'text-red-700' }, 'No se pudo cargar el contenido. Intenta más tarde.')); }
}
document.getElementById('tabs').append(...TABS.map(([t, l, p]) => h('button', { class: 'tab', role: 'tab', 'data-t': t, onclick: () => showTab(t, p) }, l)));

/* 3. Contacto (validación en cliente y en servidor) */
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget, out = document.getElementById('msg');
  if (!f.checkValidity()) { f.reportValidity(); return; }
  try {
    await api('contact', { method: 'POST', body: Object.fromEntries(new FormData(f)) });
    out.textContent = 'Mensaje enviado. Gracias por escribirnos.'; out.className = 'text-sm text-green-700'; f.reset();
  } catch (err) { out.textContent = err.message; out.className = 'text-sm text-red-700'; }
});

loadGallery(); showTab('convocatoria', 'convocatorias');
