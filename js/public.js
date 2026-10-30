// js/public.js — Vista pública: carrusel automático, tarjetas por pestaña, contacto y animaciones.
import { CONFIG as C } from './config.js';
import { renderLayout } from './layout.js';
import { h, api, safeUrl } from './utils.js';

renderLayout();

/* 1. Carrusel: avanza solo cada 4.5 s. Si el usuario lo usa (flechas, puntos, deslizar) se pausa y
      se reanuda solo tras 6 s sin actividad. Fotos: BD (colección gallery) o CONFIG.GALERIA. */
async function initSlider() {
  let fotos = [];
  try { fotos = await api('gallery'); } catch (e) { console.error('Galería:', e); }
  if (!fotos.length) fotos = C.GALERIA;
  const track = document.getElementById('track'), dots = document.getElementById('dots'), slider = document.getElementById('slider');
  track.replaceChildren(...fotos.map((f) => h('img', { src: safeUrl(f.url), alt: f.alt || 'Foto de la incubadora', loading: 'lazy', draggable: 'false' })));
  let i = 0, auto, idle;
  const go = (n) => { i = (n + fotos.length) % fotos.length; track.style.transform = `translateX(-${i * 100}%)`;
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', String(k === i))); };
  dots.replaceChildren(...fotos.map((_, k) => h('button', { 'aria-label': 'Foto ' + (k + 1), onclick: () => { go(k); usar(); } })));
  const play = () => { clearInterval(auto); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) auto = setInterval(() => go(i + 1), 4500); };
  const usar = () => { clearInterval(auto); clearTimeout(idle); idle = setTimeout(play, 6000); };
  document.getElementById('prev').onclick = () => { go(i - 1); usar(); };
  document.getElementById('next').onclick = () => { go(i + 1); usar(); };
  let x0 = null;
  slider.addEventListener('pointerdown', (e) => (x0 = e.clientX));
  slider.addEventListener('pointerup', (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 40) { go(i + (e.clientX < x0 ? 1 : -1)); usar(); } x0 = null; });
  slider.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { go(i - 1); usar(); } if (e.key === 'ArrowRight') { go(i + 1); usar(); } });
  go(0); play();
}

/* 2. Tarjetas por pestaña */
const TABS = [['convocatoria', 'Convocatorias', 'convocatorias'], ['proyecto', 'Proyectos incubados', 'proyectos incubados'], ['evento', 'Eventos', 'eventos']];
const card = (i) => h('article', { class: 'card overflow-hidden flex flex-col' },
  i.imagen ? h('img', { src: safeUrl(i.imagen), alt: '', loading: 'lazy', class: 'h-40 w-full object-cover' }) : null,
  h('div', { class: 'p-5 flex-1 flex flex-col' },
    h('div', { class: 'flex items-center justify-between gap-2' }, h('span', { class: 'chip' }, i.carrera || i.tipo), h('span', { class: 'text-xs text-slate-500' }, i.fecha || '')),
    h('h3', { class: 'font-bold text-azul text-lg mt-3' }, i.titulo), h('p', { class: 'text-sm text-slate-600 mt-2 flex-1' }, i.descripcion),
    i.responsable ? h('p', { class: 'text-xs text-slate-500 mt-3' }, 'Responsable: ' + i.responsable) : null,
    i.enlace ? h('a', { href: safeUrl(i.enlace), class: 'btn mt-4 text-center', target: '_blank', rel: 'noopener' }, 'Ver más') : null));

async function showTab(tipo, plural) {
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === tipo)));
  const grid = document.getElementById('grid');
  grid.replaceChildren(h('p', { class: 'text-slate-500' }, 'Cargando…'));
  try {
    const items = await api('items?tipo=' + tipo);
    grid.replaceChildren(...(items.length ? items.map(card) : [h('p', { class: 'text-slate-500' }, `Aún no hay ${plural} publicados.`)]));
  } catch (e) { console.error('Tarjetas:', e); grid.replaceChildren(h('p', { class: 'text-red-700' }, `No se pudo conectar con la base de datos (${e.message}).`)); }
}
document.getElementById('tabs').append(...TABS.map(([t, l, p]) => h('button', { class: 'tab', role: 'tab', 'data-t': t, onclick: () => showTab(t, p) }, l)));

/* 3. Contacto */
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget, out = document.getElementById('msg');
  if (!f.checkValidity()) { f.reportValidity(); return; }
  try { await api('contact', { method: 'POST', body: Object.fromEntries(new FormData(f)) });
    out.textContent = 'Mensaje enviado. Gracias por escribirnos.'; out.className = 'text-sm text-green-700'; f.reset();
  } catch (err) { out.textContent = err.message; out.className = 'text-sm text-red-700'; }
});

/* 4. Animación de aparición al hacer scroll */
const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

initSlider(); showTab('convocatoria', 'convocatorias');
