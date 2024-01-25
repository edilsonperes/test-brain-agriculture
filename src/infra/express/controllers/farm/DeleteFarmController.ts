import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import { DeleteFarm } from '../../../../application/usecases/farm/DeleteFarm.js';

export class DeleteFarmController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      const { id } = request.params;
      const deleteFarm = new DeleteFarm(this.farmRepository);
      const farmDataOrError = await deleteFarm.exec(id);
      if (farmDataOrError.isLeft()) {
        const error = farmDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      const farmData = farmDataOrError.value;
      if (!farmData) {
        response.sendStatus(404);
        return;
      }
      response.status(200).json(farmData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
    }
  };
}
