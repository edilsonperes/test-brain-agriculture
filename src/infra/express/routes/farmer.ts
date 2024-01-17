import { RequestHandler, Router } from 'express';
import { PostgresFarmerRepository } from '../../postgres/repository/PostgresFarmerRepository.js';
import { CreateFarmerController } from '../controllers/CreateFarmerController.js';
import { RouterHander } from './RouterHandler.js';

const handler = (router: Router) => {
  const farmerRepository = new PostgresFarmerRepository();
  const registerFarmerController = new CreateFarmerController(farmerRepository);
  router.post('/', registerFarmerController.handle as RequestHandler);
};

export const routerHander: RouterHander = {
  route: '/farmer',
  handler,
};
