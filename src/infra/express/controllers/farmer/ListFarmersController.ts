import { Request, Response } from 'express';
import { FarmerRepository } from '../../../../application/repository/FarmerRepository.js';
import { Controller } from '../Controller.js';
import { ListFarmers } from '../../../../application/usecases/farmer/ListFarmers.js';
import { FarmRepository } from '../../../../application/repository/FarmRepository.js';
import { HttpStatus } from '../HttpStatus.js';

export class ListFarmersController implements Controller {
  constructor(
    private farmerRepository: FarmerRepository,
    private farmRepository: FarmRepository,
  ) {}

  handle = async (
    request: Request<{ id?: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      const { id } = request.params;
      const listFarmers = new ListFarmers(
        this.farmerRepository,
        this.farmRepository,
      );
      const farmerDataOrError = await listFarmers.exec(id);
      if (farmerDataOrError.isLeft()) {
        const error = farmerDataOrError.value;
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      const farmerData = farmerDataOrError.value;
      response.status(HttpStatus.OK).json(farmerData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
