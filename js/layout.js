// js/layout.js — Dibuja encabezado y pie (compartidos por index.html y admin.html).
// Al integrar en el sitio oficial se puede omitir y usar el header/footer del Tec.
import { CONFIG as C } from './config.js';
import { h } from './utils.js';

export function renderLayout() {
  const nav = h('nav', { id: 'menu', class: 'hidden lg:block w-full lg:w-auto', 'aria-label': 'Principal' },
    h('ul', { class: 'flex flex-col lg:flex-row lg:items-center lg:gap-6' },
      C.NAV.map(([t, href]) => h('li', {}, h('a', { href, class: 'nav-link' }, t)))));
  const toggle = h('button', { class: 'lg:hidden px-3 py-2 text-azul font-bold border rounded', 'aria-label': 'Abrir menú', 'aria-expanded': 'false',
    onclick: (e) => { const hidden = nav.classList.toggle('hidden'); e.currentTarget.setAttribute('aria-expanded', String(!hidden)); } }, '☰ Menú');
  const logo = (src, alt) => h('img', { src, alt, class: 'h-9 sm:h-11 w-auto', onerror: (e) => (e.target.style.display = 'none') });

  document.getElementById('site-header').replaceChildren(
    h('div', { class: 'bg-black text-white text-xs' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-1.5 flex justify-between' },
      h('strong', {}, 'gob.mx'), h('span', {}, 'Trámites | Gobierno'))),
    h('div', { class: 'bg-white border-b border-slate-200 shadow-sm' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-6 gap-y-2' },
      h('a', { href: C.SITE_URL, class: 'flex items-center gap-3 shrink-0', 'aria-label': 'Instituto Tecnológico de Pachuca' },
        logo(C.LOGOS.educacion, 'Educación'), logo(C.LOGOS.tecnm, 'TecNM'), logo(C.LOGOS.itp, 'ITP')),
      toggle, nav)));

  const f = C.FOOTER;
  document.getElementById('site-footer').replaceChildren(h('div', { class: 'max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3' },
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'TecNM Campus Pachuca'), h('p', { class: 'text-slate-300 text-sm' }, f.texto)),
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'Enlaces rápidos'),
      h('ul', { class: 'text-sm text-slate-300 space-y-1' }, f.rapidos.map(([t, p]) => h('li', {}, h('a', { href: p, class: 'hover:text-white' }, t))))),
    h('div', { class: 'text-sm text-slate-300' }, h('p', { class: 'font-bold text-white mb-2' }, 'Contacto'), h('p', {}, f.direccion), h('p', {}, f.telefono))),
    h('p', { class: 'text-center text-xs text-slate-400 py-4 border-t border-white/10' }, `© ${new Date().getFullYear()} Instituto Tecnológico de Pachuca. Todos los derechos reservados.`));
}
