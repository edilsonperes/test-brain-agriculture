import { RequestHandler, Router } from 'express';
import { PostgresFarmerRepository } from '../../postgres/repository/PostgresFarmerRepository.js';
import { CreateFarmerController } from '../controllers/CreateFarmerController.js';
import { RouterHander } from './RouterHandler.js';
import { ListFarmersController } from '../controllers/ListFarmersController.js';

const handler = (router: Router) => {
  const farmerRepository = new PostgresFarmerRepository();

  const registerFarmerController = new CreateFarmerController(farmerRepository);
  router.post('/', registerFarmerController.handle as RequestHandler);

  const listFarmersController = new ListFarmersController(farmerRepository);
  router.get('/', listFarmersController.handle as RequestHandler);
  router.get('/:id', listFarmersController.handle as RequestHandler);
};

export const routerHander: RouterHander = {
  route: '/farmer',
  handler,
};
