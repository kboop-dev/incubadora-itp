// js/layout.js — Encabezado, pie y navegación suave (compartidos por index.html y admin.html).
import { CONFIG as C } from './config.js';
import { h } from './utils.js';

const enAdmin = /admin/.test(location.pathname);
const resolve = (href) => (href.startsWith('#') && enAdmin ? 'index.html' + href : href);
const externo = (href) => /^https?:/.test(href);

export function renderLayout() {
  const nav = h('nav', { id: 'menu', class: 'hidden xl:block order-3 xl:order-2 w-full xl:w-auto', 'aria-label': 'Principal' },
    h('ul', { class: 'flex flex-col xl:flex-row xl:items-center xl:gap-5 pb-2 xl:pb-0' },
      C.NAV.map(([t, href]) => h('li', {}, h('a', { href: resolve(href), class: 'nav-link', ...(externo(href) ? { target: '_blank', rel: 'noopener' } : {}) }, t)))));
  const toggle = h('button', { class: 'xl:hidden order-2 ml-auto px-3 py-1.5 text-azul font-bold border border-slate-300 rounded text-sm', 'aria-label': 'Abrir menú', 'aria-expanded': 'false',
    onclick: (e) => { const oculto = nav.classList.toggle('hidden'); e.currentTarget.setAttribute('aria-expanded', String(!oculto)); } }, '☰ Menú');
  const logo = (src, alt) => h('img', { src, alt, class: 'h-6 sm:h-10 w-auto', onerror: (e) => (e.target.style.display = 'none') });

  document.getElementById('site-header').replaceChildren(
    h('div', { class: 'bg-black text-white text-xs' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-1 flex justify-between' }, h('strong', {}, 'gob.mx'), h('span', {}, 'Trámites | Gobierno'))),
    h('div', { class: 'bg-white border-b border-slate-200 shadow-sm' }, h('div', { class: 'max-w-7xl mx-auto px-4 py-2 flex flex-wrap xl:flex-nowrap items-center gap-x-4' },
      h('a', { href: C.SITE_URL, class: 'order-1 flex items-center gap-2 sm:gap-3 shrink-0', 'aria-label': 'Instituto Tecnológico de Pachuca' },
        logo(C.LOGOS.educacion, 'Educación'), logo(C.LOGOS.tecnm, 'TecNM'), logo(C.LOGOS.itp, 'ITP')), toggle, nav)));

  const f = C.FOOTER;
  document.getElementById('site-footer').replaceChildren(h('div', { class: 'max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3' },
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'TecNM Campus Pachuca'), h('p', { class: 'text-slate-300 text-sm' }, f.texto)),
    h('div', {}, h('p', { class: 'font-bold mb-2' }, 'Enlaces rápidos'), h('ul', { class: 'text-sm text-slate-300 space-y-1' }, f.rapidos.map(([t, p]) => h('li', {}, h('a', { href: p, class: 'hover:text-white' }, t))))),
    h('div', { class: 'text-sm text-slate-300' }, h('p', { class: 'font-bold text-white mb-2' }, 'Contacto'), h('p', {}, f.direccion), h('p', {}, f.telefono))),
    h('p', { class: 'text-center text-xs text-slate-400 py-4 border-t border-white/10' }, `© ${new Date().getFullYear()} Instituto Tecnológico de Pachuca. Todos los derechos reservados.`));

  // Altura real del encabezado fija (CSS la usa para que las secciones no queden tapadas).
  const medir = () => document.documentElement.style.setProperty('--hdr', document.getElementById('site-header').offsetHeight + 'px');
  medir(); addEventListener('resize', medir); addEventListener('load', medir);

  // Navegación suave dentro de la página, sin recargar. Se corrige otra vez tras 700 ms por si
  // las imágenes cargaron y movieron el contenido.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const dest = document.getElementById(a.getAttribute('href').slice(1)); if (!dest) return;
    e.preventDefault(); history.pushState(null, '', a.getAttribute('href'));
    dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => dest.scrollIntoView({ behavior: 'auto', block: 'start' }), 700);
    if (!nav.classList.contains('xl:block') || innerWidth < 1280) { nav.classList.add('hidden'); toggle.setAttribute('aria-expanded', 'false'); }
  });
}
