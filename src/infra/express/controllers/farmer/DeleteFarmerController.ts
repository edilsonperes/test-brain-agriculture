import { Request, Response } from 'express';
import { FarmerRepository } from '../../../../application/repository/FarmerRepository.js';
import { Controller } from '../Controller.js';
import { DeleteFarmer } from '../../../../application/usecases/farmer/DeleteFarmer.js';
import { ListFarmers } from '../../../../application/usecases/farmer/ListFarmers.js';
import { DeleteFarm } from '../../../../application/usecases/farm/DeleteFarm.js';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';

export class DeleteFarmerController implements Controller {
  constructor(
    private farmerRepository: FarmerRepository,
    private farmRepository: FarmRepository,
  ) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      const { id } = request.params;
      const listFarmers = new ListFarmers(this.farmerRepository);
      const farmerDataOrError = await listFarmers.exec(id);
      if (farmerDataOrError.isLeft()) {
        const error = farmerDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      const farmerData = farmerDataOrError.value[0];
      if (!farmerData) {
        response.sendStatus(404);
        return;
      }
      const deleteFarmer = new DeleteFarmer(this.farmerRepository);
      const deleteFarm = new DeleteFarm(this.farmRepository);
      await Promise.all([
        deleteFarmer.exec(id),
        ...(farmerData.farm ? [deleteFarm.exec(farmerData.farm)] : []),
      ]);
      response.status(200).json(farmerData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
    }
  };
}
