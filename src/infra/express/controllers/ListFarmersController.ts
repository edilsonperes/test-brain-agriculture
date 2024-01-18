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
      const farmerData = await listFarmers.exec(id);
      response.status(200).json(farmerData);
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
