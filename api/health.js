// GET /api/health — diagnóstico de conexión. BORRAR este archivo cuando todo funcione.
import { db } from './_lib.js';
export default async function handler(req, res) {
  const env = { MONGODB_URI: !!process.env.MONGODB_URI, MONGODB_DB: !!process.env.MONGODB_DB, ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD, JWT_SECRET: !!process.env.JWT_SECRET };
  const entorno = process.env.VERCEL_ENV || 'local'; // production | preview | development
  if (!env.MONGODB_URI) return res.status(500).json({ entorno, env, pista: 'Esta URL no ve MONGODB_URI. Abre la URL de Producción (nombre-proyecto.vercel.app) o agrega las variables también en Preview, y haz Redeploy.' });
  try { await (await db()).command({ ping: 1 }); res.json({ entorno, env, mongo: 'ok' }); }
  catch (e) {
    const m = String(e.message), pista = /auth/i.test(m) ? 'Usuario o contraseña de BD incorrectos (si la clave tiene @ : / ? # va codificada en la URI).'
      : /ENOTFOUND|querySrv/i.test(m) ? 'La cadena MONGODB_URI está mal escrita (revisa el host del clúster).'
      : /Server selection|timed out|ECONNREFUSED/i.test(m) ? 'Atlas bloquea la conexión: en Network Access agrega 0.0.0.0/0.' : 'Revisa el detalle.';
    res.status(500).json({ entorno, env, mongo: 'error', pista, detalle: `${e.name}: ${m.slice(0, 150)}` });
  }
}
