import { RequestHandler, Router } from 'express';
import { PostgresFarmRepository } from '../../postgres/repository/PostgresFarmRepository.js';
import { RouterHander } from './RouterHandler.js';
import { CreateFarmController } from '../controllers/farm/CreateFarmController.js';
import { ListFarmsController } from '../controllers/farm/ListFarmsController.js';
import { UpdateFarmController } from '../controllers/farm/UpdateFarmController.js';

const handler = (router: Router) => {
  const farmRepository = new PostgresFarmRepository();

  const createFarmController = new CreateFarmController(farmRepository);
  router.post('/', createFarmController.handle as RequestHandler);

  const listFarmsController = new ListFarmsController(farmRepository);
  router.get('/', listFarmsController.handle as RequestHandler);
  router.get('/:id', listFarmsController.handle as RequestHandler);

  const updateFarmController = new UpdateFarmController(farmRepository);
  router.patch(
    '/:id',
    updateFarmController.handle as RequestHandler<{ id: string }>,
  );
};

export const farmRouterHander: RouterHander = {
  route: '/farm',
  handler,
};
