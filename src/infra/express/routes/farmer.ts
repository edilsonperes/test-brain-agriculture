import { RequestHandler, Router } from 'express';
import { PostgresFarmerRepository } from '../../postgres/repository/PostgresFarmerRepository.js';
import { RouterHander } from './RouterHandler.js';
import { CreateFarmerController } from '../controllers/farmer/CreateFarmerController.js';
import { ListFarmersController } from '../controllers/farmer/ListFarmersController.js';
import { DeleteFarmerController } from '../controllers/farmer/DeleteFarmerController.js';
import { UpdateFarmerController } from '../controllers/farmer/UpdateFarmerController.js';
import { PostgresFarmRepository } from '../../postgres/repository/PostgresFarmRepository.js';

const handler = (router: Router) => {
  const farmerRepository = new PostgresFarmerRepository();
  const farmRepository = new PostgresFarmRepository();

  const createFarmerController = new CreateFarmerController(farmerRepository);
  router.post('/', createFarmerController.handle as RequestHandler);

  const listFarmersController = new ListFarmersController(
    farmerRepository,
    farmRepository,
  );
  router.get('/', listFarmersController.handle as RequestHandler);
  router.get('/:id', listFarmersController.handle as RequestHandler);

  const deleteFarmerController = new DeleteFarmerController(
    farmerRepository,
    farmRepository,
  );
  router.delete(
    '/:id',
    deleteFarmerController.handle as RequestHandler<{ id: string }>,
  );

  const updateFarmerController = new UpdateFarmerController(farmerRepository);
  router.patch(
    '/:id',
    updateFarmerController.handle as RequestHandler<{ id: string }>,
  );
};

export const farmerRouterHander: RouterHander = {
  route: '/farmer',
  handler,
};
