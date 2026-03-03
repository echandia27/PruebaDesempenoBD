import 'dotenv/config';

export const env = {
  APP_PORT: Number(process.env.APP_PORT || 3000),
  DB: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT || 5432),
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PWD,
  },
  MONGO: {
    URI: process.env.MONGO_URI,
    DB: process.env.MONGO_DB,
  },
};