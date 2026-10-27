// GET /api/health — diagnóstico: ¿están las variables y conecta MongoDB? BORRAR este archivo al terminar la configuración.
import { db } from './_lib.js';
export default async function handler(req, res) {
  const env = { MONGODB_URI: !!process.env.MONGODB_URI, ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD, JWT_SECRET: !!process.env.JWT_SECRET };
  try { await (await db()).command({ ping: 1 }); res.json({ env, mongo: 'ok' }); }
  catch (e) { res.status(500).json({ env, mongo: 'error', detalle: `${e.name}: ${String(e.message).slice(0, 150)}` }); }
}
