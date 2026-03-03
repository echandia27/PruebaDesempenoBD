import { MongoClient } from 'mongodb';
import { env } from './env.js';

let client;
let db;

export async function connectMongo() {
  if (db) return db;

  if (!env.MONGO.URI) throw new Error('MONGO_URI no está definido en .env');
  if (!env.MONGO.DB) throw new Error('MONGO_DB no está definido en .env');

  client = new MongoClient(env.MONGO.URI);
  await client.connect();
  db = client.db(env.MONGO.DB);

  // índices útiles para auditoría
  await db.collection('logs_auditoria').createIndex({ fecha: -1 });
  await db.collection('logs_auditoria').createIndex({ entidad: 1, entidad_id: 1 });

  return db;
}

export function getMongoDb() {
  if (!db) throw new Error('MongoDB no conectado. Llama connectMongo() al iniciar el servidor.');
  return db;
}

export async function closeMongo() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}