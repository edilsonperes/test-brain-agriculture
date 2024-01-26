import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import {
  FarmUpdate,
  UpdateFarm,
} from '../../../../application/usecases/farm/UpdateFarm.js';
import { HttpStatus } from '../HttpStatus.js';

export class UpdateFarmController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      if (!request.body) {
        response.status(HttpStatus.BAD_REQUEST).send('Missing request body.');
        return;
      }
      const update = request.body as FarmUpdate;
      if (update.crops && !Array.isArray(update.crops)) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .send('Crops must be an array of updates.');
        return;
      }
      const { id } = request.params;
      const updateFarm = new UpdateFarm(this.farmRepository);
      const farmDataOrError = await updateFarm.exec(id, update);
      const farmData = farmDataOrError.value;
      if (farmDataOrError.isLeft()) {
        const error = farmDataOrError.value;
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      response.status(HttpStatus.OK).json(farmData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
