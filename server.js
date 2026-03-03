import app from './src/app.js';
import { env } from './src/config/env.js';
import { pingPostgres } from './src/config/postgres.js';
import { connectMongo } from './src/config/mongo.js';

async function bootstrap() {
  // Validar conexiones antes de escuchar
  const pgOk = await pingPostgres();
  if (!pgOk) throw new Error('No se pudo validar conexión a PostgreSQL');

  await connectMongo();

  app.listen(env.APP_PORT, () => {
    console.log(`🚀 servidor corriendo en http://localhost:${env.APP_PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ error al iniciar el servidor:', err);
  process.exit(1);
});