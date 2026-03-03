import { guardarLogAuditoria } from '../repositories/auditoria.repository.mongo.js';

export async function logDeleteProducto({ productoSnapshot, req }) {
  const doc = {
    entidad: 'producto',
    entidad_id: productoSnapshot.id,
    accion: 'delete',
    fecha: new Date(),
    snapshot: productoSnapshot,
    metadata: {
      ip: req.ip,
      user_agent: req.headers['user-agent'] || null,
      endpoint: `${req.method} ${req.originalUrl}`,
    },
  };

  return guardarLogAuditoria(doc);
}