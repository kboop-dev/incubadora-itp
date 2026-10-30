// js/config.js — ÚNICO lugar para cambiar menú, enlaces, logos y fotos de la galería.
const SITE = 'https://itpachuca.edu.mx'; // sitio oficial del Tec (verificar)
export const CONFIG = {
  SITE_URL: SITE,
  // Menú. "#algo" = sección de esta página (en admin.html se convierte solo en index.html#algo).
  NAV: [
    ['Principal', 'https://share.google/oaC97EEDFEF6HNkvi'], ['Inicio', '#inicio'], ['Quiénes somos', '#nosotros'], ['Productos', '#productos'],
    ['Galería', '#galeria'], ['Convocatorias', '#convocatorias'], ['Fases', '#fases'], ['Contacto', '#contacto'],
  ],
  FOOTER: {
    texto: 'Formando profesionistas comprometidos con el desarrollo tecnológico y social de México desde 1938.',
    direccion: 'Carr. México-Pachuca Km 87.5, Pachuca, Hidalgo, México', telefono: '(771) 711 3073',
    rapidos: [['Sitio oficial ITP', SITE], ['Alumnos', SITE + '/alumnos'], ['TecNM', 'https://www.tecnm.mx']],
  },
  LOGOS: { educacion: 'assets/educacion.png', tecnm: 'assets/tecnm.png', itp: 'assets/itp.png' },
  // GALERÍA (10 imágenes de ejemplo). Para cambiar una foto: reemplaza el archivo en assets/galeria/
  // (mismo nombre) o cambia la ruta aquí. Si la base de datos tiene fotos, estas se ignoran.
  GALERIA: Array.from({ length: 10 }, (_, i) => ({ url: `assets/galeria/${String(i + 1).padStart(2, '0')}.svg`, alt: `Imagen ${i + 1} de la incubadora` })),
};
