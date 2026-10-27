// js/config.js — ÚNICO lugar para cambiar menú, enlaces, logos y fotos de respaldo.
const SITE = 'https://itpachuca.edu.mx'; // sitio oficial del Tec (verificar)
export const CONFIG = {
  SITE_URL: SITE,
  // Menú: "Inicio" va al sitio oficial; lo demás son secciones de esta misma página.
  NAV: [
    ['Inicio', SITE], ['Quiénes somos', 'index.html#nosotros'], ['Galería', 'index.html#galeria'],
    ['Convocatorias y proyectos', 'index.html#convocatorias'], ['Fases y requisitos', 'index.html#fases'], ['Contacto', 'index.html#contacto'],
  ],
  FOOTER: {
    texto: 'Formando profesionistas comprometidos con el desarrollo tecnológico y social de México desde 1938.',
    direccion: 'Carr. México-Pachuca Km 87.5, Pachuca, Hidalgo, México', telefono: '(771) 711 3073',
    rapidos: [['Sitio oficial ITP', SITE], ['Alumnos', SITE + '/alumnos'], ['TecNM', 'https://www.tecnm.mx']],
  },
  LOGOS: { educacion: 'assets/educacion.png', tecnm: 'assets/tecnm.png', itp: 'assets/itp.png' },
  // FOTOS DE RESPALDO: se muestran si la galería de la BD está vacía. Guarda las imágenes en
  // /assets/galeria/ y agrégalas aquí: { url: 'assets/galeria/foto1.jpg', alt: 'Descripción' }
  GALERIA: [],
};
