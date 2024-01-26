import { Request, Response } from 'express';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { Controller } from '../Controller.js';
import { DeleteFarm } from '../../../../application/usecases/farm/DeleteFarm.js';
import { HttpStatus } from '../HttpStatus.js';

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
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      const farmData = farmDataOrError.value;
      if (!farmData) {
        response.sendStatus(HttpStatus.NOT_FOUND);
        return;
      }
      response.status(HttpStatus.OK).json(farmData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
