# Incubadora de Proyectos — ITP
Frontend: HTML + Tailwind (CDN) + JS ES modules. Backend: funciones serverless en /api (Vercel) + MongoDB Atlas.
## Estructura
- index.html / admin.html — vistas pública y de administración
- css/styles.css — estilos propios · js/config.js — menú, enlaces, logos (EDITAR AQUÍ) · js/layout.js — header/footer
- js/public.js, js/admin.js, js/utils.js · api/ — login, contacto, CRUD genérico (`[col].js`)
## Puesta en marcha
1. Crear clúster en MongoDB Atlas (usuario de BD + Network Access) y copiar la cadena de conexión.
2. Copiar `.env.example` a `.env.local` y llenar valores. `npm install` · `npx vercel dev` para probar local.
3. Subir a GitHub → Importar en Vercel → agregar las 4 variables de entorno → Deploy.
4. Poner los logos oficiales en /assets (educacion.png, tecnm.png, itp.png). Panel en /admin.
## Integrarlo al sitio del Tec
Opción A (recomendada): enlazar/embeber la URL de Vercel como página del apartado. Opción B: copiar index.html, /css, /js y /api al hosting del Tec (requiere Node/serverless para /api y MongoDB).
Si el Tec ya tiene header/footer propios, quitar `renderLayout()` y los dos contenedores #site-header/#site-footer.
