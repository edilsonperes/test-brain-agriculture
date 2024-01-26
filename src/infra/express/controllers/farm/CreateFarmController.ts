import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import {
  CreateFarm,
  FarmProps,
} from '../../../../application/usecases/farm/CreateFarm.js';
import { Controller } from '../Controller.js';
import { HttpStatus } from '../HttpStatus.js';

export class CreateFarmController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    try {
      if (!request.body) {
        response.status(HttpStatus.BAD_REQUEST).send('Missing request body.');
        return;
      }
      const createFarm = new CreateFarm(this.farmRepository);
      const farmIdOrError = await createFarm.exec(request.body as FarmProps);
      if (farmIdOrError.isLeft()) {
        const error = farmIdOrError.value;
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      response.status(HttpStatus.CREATED).json({ id: farmIdOrError.value });
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
