import { Request, Response } from 'express';
import { FarmerRepository } from '../../../application/repository/FarmerRepository.js';
import { Controller } from './Controller.js';
import { ListFarmers } from '../../../application/usecases/farmer/ListFarmers.js';

export class ListFarmersController implements Controller {
  constructor(private farmerRepository: FarmerRepository) {}

  handle = async (
    request: Request<{ id?: string }>,
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
      const farmerData = farmerDataOrError.value;
      response.status(200).json(farmerData);
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}