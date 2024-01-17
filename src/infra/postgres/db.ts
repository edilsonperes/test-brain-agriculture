import pg from 'pg';
import { Sequelize } from 'sequelize';

const { POSTGRES_DB, POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_HOST } =
  process.env;

if (
  !POSTGRES_DB ||
  !POSTGRES_USERNAME ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_HOST
) {
  throw new Error(`Missing environment variable`);
}

const initialConnectionString = `postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/postgres`;

const client = new pg.Client(initialConnectionString);
await client.connect();
const queryDatabaseNames = await client.query(
  'SELECT datname FROM pg_database',
);
const dbs = queryDatabaseNames.rows.map(
  (item: { datname: string }) => item.datname,
);
if (!dbs.includes(POSTGRES_DB)) {
  await client.query(`CREATE DATABASE ${POSTGRES_DB}`);
  console.log(`Database created: ${POSTGRES_DB}`);
}

export const db = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
);
