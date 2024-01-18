import { Sequelize } from 'sequelize';

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

if (!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD) {
  throw new Error('Missing required environment variables');
}

export const db = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: 'db',
  dialect: 'postgres',
});
