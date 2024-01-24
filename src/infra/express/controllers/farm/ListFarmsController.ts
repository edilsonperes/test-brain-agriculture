import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import { ListFarms } from '../../../../application/usecases/farm/ListFarms.js';

export class ListFarmsController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (
    request: Request<{ id?: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      const { id } = request.params;
      const listFarms = new ListFarms(this.farmRepository);
      const farmDataOrError = await listFarms.exec(id);
      if (farmDataOrError.isLeft()) {
        const error = farmDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      const farmData = farmDataOrError.value;
      response.status(200).json(farmData);
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
