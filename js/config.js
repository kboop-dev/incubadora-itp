// js/config.js — ÚNICO lugar para cambiar textos globales, enlaces y menú del sitio.
export const CONFIG = {
  // Sitio oficial del Tec. "Inicio" del menú lleva aquí para que la navegación sea completa.
  SITE_URL: 'https://itpachuca.edu.mx',
  // Menú principal (mismo orden que el portal oficial). Ajusta las rutas si el Tec las cambia.
  NAV: [
    ['Inicio', '/'], ['Nosotros', '/nosotros'], ['Ingenierías', '/ingenierias'], ['Noticias', '/noticias'],
    ['Alumnos', '/alumnos'], ['Maestría', '/maestria'], ['Doctorado', '/doctorado'],
    ['Directorio', '/directorio'], ['Departamentos', '/departamentos'],
  ],
  INCUBADORA_LABEL: 'Incubadora', // entrada propia del menú (se resalta como página actual)
  // Barra secundaria (Buscar, Avisos, Sitios...). Solo enlaces al sitio oficial.
  SUBNAV: [['Avisos', '/avisos'], ['Sitios', '/sitios'], ['Publicaciones', '/publicaciones'], ['Agenda', '/agenda'], ['Sistemas', '/sistemas'], ['Formatos', '/formatos']],
  // Pie de página
  FOOTER: {
    texto: 'Formando profesionistas comprometidos con el desarrollo tecnológico y social de México desde 1938.',
    direccion: 'Carr. México-Pachuca Km 87.5, Pachuca, Hidalgo, México', telefono: '(771) 711 3073',
    rapidos: [['Oferta Educativa', '/'], ['Admisión', '/'], ['Calendario', '/'], ['Becas', '/']],
  },
  // Logos: coloca los archivos oficiales en /assets con estos nombres.
  LOGOS: { educacion: 'assets/educacion.png', tecnm: 'assets/tecnm.png', itp: 'assets/itp.png' },
};
