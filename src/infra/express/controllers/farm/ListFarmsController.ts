import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import { ListFarms } from '../../../../application/usecases/farm/ListFarms.js';
import { HttpStatus } from '../HttpStatus.js';

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
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      const farmData = farmDataOrError.value;
      response.status(HttpStatus.OK).json(farmData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
