import express, { json } from 'express';
import { setupRoutes } from './setupRoutes.js';

const app = express();
app.use(json());
setupRoutes(app);

export default app;
