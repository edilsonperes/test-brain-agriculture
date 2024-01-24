import { Request, Response } from 'express';
import { FarmerRepository } from '../../../../application/repository/FarmerRepository.js';
import { Controller } from '../Controller.js';
import { DeleteFarmer } from '../../../../application/usecases/farmer/DeleteFarmer.js';

export class DeleteFarmerController implements Controller {
  constructor(private farmerRepository: FarmerRepository) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      const { id } = request.params;
      const deleteFarmer = new DeleteFarmer(this.farmerRepository);
      const farmerDataOrError = await deleteFarmer.exec(id);
      if (farmerDataOrError.isLeft()) {
        const error = farmerDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      const farmerData = farmerDataOrError.value;
      if (!farmerData) {
        response.sendStatus(404);
        return;
      }
      response.status(200).json(farmerData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
