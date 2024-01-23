import { Request, Response } from 'express';
import { FarmerRepository } from '../../../application/repository/FarmerRepository.js';
import { Controller } from './Controller.js';
import { UpdateFarmer } from '../../../application/usecases/farmer/UpdateFarmer.js';

type UpdateFarmerRequestBody = {
  name?: string;
  farm?: string | null;
};

export class UpdateFarmerController implements Controller {
  constructor(private farmerRepository: FarmerRepository) {}

  handle = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> => {
    try {
      if (!request.body) {
        response.status(400).send('Missing request body.');
        return;
      }
      const { id } = request.params;
      const { name, farm } = request.body as UpdateFarmerRequestBody;
      if (!name && farm === undefined) {
        response.status(400).send('Missing update parameters.');
        return;
      }

      const updateFarmer = new UpdateFarmer(this.farmerRepository);
      const farmerDataOrError = await updateFarmer.exec(id, { name, farm });
      const farmerData = farmerDataOrError.value;
      if (farmerDataOrError.isLeft()) {
        const error = farmerDataOrError.value;
        response.status(400).send(error.message);
        return;
      }
      response.status(200).json(farmerData);
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
