// js/public.js — Lógica de la vista pública: galería, tarjetas por pestaña y formulario de contacto.
import { renderLayout } from './layout.js';
import { h, api, safeUrl } from './utils.js';

renderLayout();

/* ---------- 1. Galería (carrusel con scroll-snap) ---------- */
async function loadGallery() {
  const box = document.getElementById('carousel');
  try {
    const fotos = await api('gallery');
    box.replaceChildren(...fotos.map((f) => h('img', { src: safeUrl(f.url), alt: f.alt || 'Foto de la incubadora', loading: 'lazy', class: 'h-64 w-full object-cover rounded-lg' })));
    if (!fotos.length) box.replaceChildren(h('p', { class: 'text-slate-500' }, 'Pronto habrá fotos.'));
  } catch { box.replaceChildren(h('p', { class: 'text-slate-500' }, 'No se pudo cargar la galería.')); }
}
for (const [id, dir] of [['prev', -1], ['next', 1]])
  document.getElementById(id).addEventListener('click', () => { const c = document.getElementById('carousel'); c.scrollBy({ left: dir * c.clientWidth * 0.8 }); });

/* ---------- 2. Tarjetas (convocatorias / proyectos / eventos) ---------- */
const TABS = [['convocatoria', 'Convocatorias'], ['proyecto', 'Proyectos incubados'], ['evento', 'Eventos']];
const card = (i) => h('article', { class: 'card overflow-hidden flex flex-col' },
  i.imagen ? h('img', { src: safeUrl(i.imagen), alt: '', loading: 'lazy', class: 'h-40 w-full object-cover' }) : null,
  h('div', { class: 'p-5 flex-1 flex flex-col' },
    h('p', { class: 'text-xs text-dorado font-bold' }, [i.carrera, i.fecha].filter(Boolean).join(' · ')),
    h('h3', { class: 'font-bold text-azul text-lg mt-1' }, i.titulo),
    h('p', { class: 'text-sm text-slate-600 mt-2 flex-1' }, i.descripcion),
    i.responsable ? h('p', { class: 'text-xs text-slate-500 mt-2' }, 'Responsable: ' + i.responsable) : null,
    i.enlace ? h('a', { href: safeUrl(i.enlace), class: 'btn mt-4 text-center', target: '_blank', rel: 'noopener' }, 'Ver más') : null));

async function showTab(tipo) {
  const grid = document.getElementById('grid');
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === tipo)));
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('!bg-guinda', b.dataset.t === tipo));
  try {
    const items = await api('items?tipo=' + tipo);
    grid.replaceChildren(...(items.length ? items.map(card) : [h('p', { class: 'text-slate-500' }, 'Aún no hay publicaciones en esta sección.')]));
  } catch { grid.replaceChildren(h('p', { class: 'text-red-700' }, 'No se pudo cargar el contenido. Intenta más tarde.')); }
}
document.getElementById('tabs').append(...TABS.map(([t, l]) => h('button', { class: 'btn', role: 'tab', 'data-t': t, onclick: () => showTab(t) }, l)));

/* ---------- 3. Formulario de contacto (validación cliente + servidor) ---------- */
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget, out = document.getElementById('msg');
  if (!f.checkValidity()) { f.reportValidity(); return; }
  try {
    await api('contact', { method: 'POST', body: Object.fromEntries(new FormData(f)) });
    out.textContent = 'Mensaje enviado. Gracias por escribirnos.'; out.className = 'text-sm text-green-700'; f.reset();
  } catch (err) { out.textContent = err.message; out.className = 'text-sm text-red-700'; }
});

loadGallery(); showTab('convocatoria');
