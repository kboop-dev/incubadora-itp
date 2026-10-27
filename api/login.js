// POST /api/login  { password }  ->  { token }
// Un solo acceso compartido para los encargados (no hay registro de usuarios).
import crypto from 'crypto';
import { makeToken } from './_lib.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const a = Buffer.from(String(req.body?.password || ''));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || '');
  const ok = b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });
  res.json({ token: makeToken() });
}
