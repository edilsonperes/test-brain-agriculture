import { RequestHandler, Router } from 'express';
import { PostgresFarmerRepository } from '../../postgres/repository/PostgresFarmerRepository.js';
import { CreateFarmerController } from '../controllers/CreateFarmerController.js';
import { RouterHander } from './RouterHandler.js';
import { ListFarmersController } from '../controllers/ListFarmersController.js';
import { DeleteFarmerController } from '../controllers/DeleteFarmerController.js';
import { UpdateFarmerController } from '../controllers/UpdateFarmerController.js';

const handler = (router: Router) => {
  const farmerRepository = new PostgresFarmerRepository();

  const registerFarmerController = new CreateFarmerController(farmerRepository);
  router.post('/', registerFarmerController.handle as RequestHandler);

  const listFarmersController = new ListFarmersController(farmerRepository);
  router.get('/', listFarmersController.handle as RequestHandler);
  router.get('/:id', listFarmersController.handle as RequestHandler);

  const deleteFarmerController = new DeleteFarmerController(farmerRepository);
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

export const routerHander: RouterHander = {
  route: '/farmer',
  handler,
};
