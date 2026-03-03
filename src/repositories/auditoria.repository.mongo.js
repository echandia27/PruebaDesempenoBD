import { getMongoDb } from '../config/mongo.js';

export async function guardarLogAuditoria(doc) {
  const db = getMongoDb();
  const r = await db.collection('logs_auditoria').insertOne(doc);
  return r.insertedId;
}