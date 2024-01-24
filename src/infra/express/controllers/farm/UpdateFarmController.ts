import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import {
  FarmUpdate,
  UpdateFarm,
} from '../../../../application/usecases/farm/UpdateFarm.js';

type UpdateFarmRequestBody = FarmUpdate[];

export class UpdateFarmController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      if (!request.body) {
        response.status(400).send('Missing request body.');
        return;
      }
      if (!Array.isArray(request.body)) {
        response.status(400).send('Request body must be an array of updates.');
        return;
      }
      const { id } = request.params;
      const updates = request.body as UpdateFarmRequestBody;
      const updateFarm = new UpdateFarm(this.farmRepository);
      const farmDataOrError = await updateFarm.exec(id, updates);
      const farmData = farmDataOrError.value;
      if (farmDataOrError.isLeft()) {
        const error = farmDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      response.status(200).json(farmData);
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
