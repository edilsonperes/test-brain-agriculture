import 'dotenv/config';
import { db } from './infra/postgres/db.js';
import server from './infra/express/app.js';

db.sync()
  .then(() => {
    const { SERVER_PORT } = process.env;

    if (!SERVER_PORT) {
      throw new Error("Missing environment variavle. 'SERVER_PORT'");
    }
    server.listen(SERVER_PORT, () => {
      console.log(`App listening on port ${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    throw error;
  });
