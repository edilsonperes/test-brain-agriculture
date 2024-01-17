import express, { json } from 'express';
import { setupRoutes } from './setupRoutes.js';

const app = express();
app.use(json());

app.get('/', (_req, res) => {
  res.send('Hello world');
});
setupRoutes(app);

export default app;
