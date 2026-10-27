// js/layout.js — Dibuja encabezado y pie (compartidos por index.html y admin.html).
// Al integrar en el sitio oficial, se puede borrar este archivo y usar el header/footer del Tec.
import { CONFIG as C } from './config.js';
import { h } from './utils.js';

const abs = (p) => C.SITE_URL + (p === '/' ? '' : p);
const link = (t, href, cls = '') => h('a', { href, class: 'nav-link ' + cls }, t);

export function renderLayout() {
  const nav = h('nav', { id: 'menu', class: 'hidden lg:flex flex-col lg:items-end gap-1 w-full lg:w-auto', 'aria-label': 'Principal' },
    h('ul', { class: 'flex flex-col lg:flex-row lg:gap-5' },
      C.NAV.map(([t, p]) => h('li', {}, link(t, abs(p)))),
      h('li', {}, link(C.INCUBADORA_LABEL, 'index.html', 'text-guinda border-b-2 border-dorado'))),
    h('ul', { class: 'flex flex-wrap lg:gap-4 mt-1 text-[11px]' }, C.SUBNAV.map(([t, p]) => h('li', {}, link(t, abs(p), 'sub')))));
  const toggle = h('button', { class: 'lg:hidden p-2 text-azul', 'aria-label': 'Abrir menú', 'aria-expanded': 'false',
    onclick: (e) => { const o = nav.classList.toggle('hidden'); e.currentTarget.setAttribute('aria-expanded', String(!o)); } }, '☰ Menú');
  const logo = (src, alt, cls) => h('img', { src, alt, class: cls, onerror: (e) => (e.target.style.display = 'none') });

  document.getElementById('site-header').replaceChildren(
    h('div', { class: 'bg-black text-white text-xs' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-1.5 flex justify-between' },
      h('strong', {}, 'gob.mx'), h('span', {}, 'Trámites | Gobierno'))),
    h('div', { class: 'bg-white border-b border-slate-200' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3' },
      h('a', { href: C.SITE_URL, class: 'flex items-center gap-3', 'aria-label': 'Instituto Tecnológico de Pachuca' },
        logo(C.LOGOS.educacion, 'Educación', 'h-10'), logo(C.LOGOS.tecnm, 'TecNM', 'h-10'), logo(C.LOGOS.itp, 'ITP', 'h-10')),
      toggle, nav)));

  const f = C.FOOTER;
  document.getElementById('site-footer').replaceChildren(h('div', { class: 'max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3' },
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'TecNM Campus Pachuca'), h('p', { class: 'text-slate-300 text-sm' }, f.texto)),
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'Enlaces rápidos'),
      h('ul', { class: 'text-sm text-slate-300 space-y-1' }, f.rapidos.map(([t, p]) => h('li', {}, h('a', { href: abs(p), class: 'hover:text-white' }, t))))),
    h('div', { class: 'text-sm text-slate-300' }, h('p', { class: 'font-bold text-white mb-2' }, 'Contacto'), h('p', {}, f.direccion), h('p', {}, f.telefono))),
    h('p', { class: 'text-center text-xs text-slate-400 py-4 border-t border-white/10' }, `© ${new Date().getFullYear()} Instituto Tecnológico de Pachuca. Todos los derechos reservados.`));
}
