// api/_lib.js — Utilidades compartidas del backend: conexión a MongoDB y autenticación admin.
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

// Se reutiliza la conexión entre invocaciones (evita abrir una nueva en cada request).
let client;
export async function db() {
  client ||= new MongoClient(process.env.MONGODB_URI).connect();
  return (await client).db(process.env.MONGODB_DB || 'incubadora_itp');
}

// Token firmado con HMAC: "<expiración>.<firma>". Dura 2 horas. No requiere tabla de usuarios.
const sign = (p) => crypto.createHmac('sha256', process.env.JWT_SECRET).update(p).digest('hex');
export const makeToken = () => { const p = String(Date.now() + 2 * 3600e3); return `${p}.${sign(p)}`; };

export function isAdmin(req) {
  const [p, s] = (req.headers.authorization || '').replace('Bearer ', '').split('.');
  if (!p || !s) return false;
  const ok = sign(p);
  return s.length === ok.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(ok)) && Number(p) > Date.now();
}
