// /api/items y /api/gallery — CRUD genérico. GET es público; POST/PUT/DELETE exigen token de admin.
// Para agregar una colección nueva basta con añadirla a FIELDS (lista blanca de campos permitidos).
import { ObjectId } from 'mongodb';
import { db, isAdmin } from './_lib.js';

const FIELDS = {
  items:   ['tipo', 'titulo', 'descripcion', 'imagen', 'fecha', 'enlace', 'estatus', 'carrera', 'responsable'],
  gallery: ['url', 'alt', 'orden'],
};
const ENUMS = { tipo: ['convocatoria', 'proyecto', 'evento'], estatus: ['publicado', 'borrador'] };

// Solo campos permitidos, como texto recortado (evita inyección de operadores tipo {"$ne":..}).
function clean(col, body = {}) {
  const out = {};
  for (const f of FIELDS[col]) {
    if (body[f] === undefined) continue;
    out[f] = f === 'orden' ? Number(body[f]) || 0 : String(body[f]).trim().slice(0, 2000);
    if (ENUMS[f] && !ENUMS[f].includes(out[f])) throw new Error(`Valor inválido en ${f}`);
  }
  return out;
}

export default async function handler(req, res) {
  const col = req.query.col;
  if (!FIELDS[col]) return res.status(404).json({ error: 'No existe' });
  try {
    const c = (await db()).collection(col);
    if (req.method === 'GET') {
      const filtro = {};
      if (col === 'items' && !(isAdmin(req) && req.query.all)) filtro.estatus = 'publicado';
      if (col === 'items' && ENUMS.tipo.includes(req.query.tipo)) filtro.tipo = req.query.tipo;
      const orden = col === 'items' ? { fecha: -1 } : { orden: 1 };
      return res.json(await c.find(filtro).sort(orden).limit(200).toArray());
    }
    if (!isAdmin(req)) return res.status(401).json({ error: 'Sesión no válida' });
    if (req.method === 'POST') {
      const r = await c.insertOne({ ...clean(col, req.body), creadoEn: new Date() });
      return res.status(201).json({ _id: r.insertedId });
    }
    const id = new ObjectId(String(req.query.id));
    if (req.method === 'PUT') {
      await c.updateOne({ _id: id }, { $set: { ...clean(col, req.body), actualizadoEn: new Date() } });
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') { await c.deleteOne({ _id: id }); return res.json({ ok: true }); }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (e) { console.error(e); res.status(e.name?.startsWith('Mongo') ? 500 : 400).json({ error: e.message }); }
}
