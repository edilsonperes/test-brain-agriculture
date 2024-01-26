import { RequestHandler, Router } from 'express';
import { PostgresFarmRepository } from '../../postgres/repository/PostgresFarmRepository.js';
import { DashboardController } from '../controllers/DashboardController.js';
import { RouterHander } from './RouterHandler.js';

const handler = (router: Router) => {
  const farmRepository = new PostgresFarmRepository();
  const dashboardController = new DashboardController(farmRepository);
  router.get('/', dashboardController.handle as RequestHandler);
};

export const dashboardRouterHander: RouterHander = {
  route: '/dashboard',
  handler,
};
