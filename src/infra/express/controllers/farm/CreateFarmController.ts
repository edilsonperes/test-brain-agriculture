import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import {
  CreateFarm,
  FarmProps,
} from '../../../../application/usecases/farm/CreateFarm.js';
import { Controller } from '../Controller.js';

export class CreateFarmController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    try {
      if (!request.body) {
        response.status(400).send('Missing request body.');
        return;
      }
      const createFarm = new CreateFarm(this.farmRepository);
      const farmIdOrError = await createFarm.exec(request.body as FarmProps);
      if (farmIdOrError.isLeft()) {
        const error = farmIdOrError.value;
        response.status(400).send(error.message);
        return;
      }
      response.status(200).json({ id: farmIdOrError.value });
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
