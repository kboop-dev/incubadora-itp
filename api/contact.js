// POST /api/contact -> guarda un mensaje del formulario de contacto en la colección "mensajes".
import { db } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { nombre = '', correo = '', mensaje = '' } = req.body || {};
  // Validación del lado del servidor (la del cliente es solo comodidad).
  if (nombre.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(correo) || mensaje.trim().length < 10)
    return res.status(400).json({ error: 'Revisa nombre, correo y mensaje (mínimo 10 caracteres).' });
  await (await db()).collection('mensajes').insertOne({
    nombre: nombre.trim().slice(0, 100), correo: correo.trim().slice(0, 120),
    mensaje: mensaje.trim().slice(0, 2000), leido: false, creadoEn: new Date(),
  });
  res.status(201).json({ ok: true });
}
