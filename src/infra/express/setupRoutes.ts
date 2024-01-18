import * as routers from './routes/index.js';
import { Express, Router } from 'express';

export const setupRoutes = (app: Express): void => {
  for (const { route, handler } of Object.values(routers)) {
    const router = Router();
    handler(router);
    app.use(route, router);
  }
};
