import { Request, Response } from 'express';
import { FarmerRepository } from '../../../../application/repository/FarmerRepository.js';
import {
  CreateFarmer,
  FarmerProps,
} from '../../../../application/usecases/farmer/CreateFarmer.js';
import { Controller } from '../Controller.js';

export class CreateFarmerController implements Controller {
  constructor(private farmerRepository: FarmerRepository) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    const { id, name, CPF, CNPJ } = request.body as Partial<FarmerProps>;

    if (!name) {
      response.status(400).send('Missing required parameter: "name"');
      return;
    }

    if (!CPF && !CNPJ) {
      response
        .status(400)
        .send('Farmer needs to be created with either CPF or CNPJ');
      return;
    }

    const createFarmer = new CreateFarmer(this.farmerRepository);
    const farmerData = CPF ? { id, name, CPF } : { id, name, CNPJ: CNPJ! };

    try {
      const farmerIdOrError = await createFarmer.exec(farmerData);

      if (farmerIdOrError.isLeft()) {
        const error = farmerIdOrError.value;
        response.status(400).send(error.message);
        return;
      }
      response.status(200).json({ id: farmerIdOrError.value });
      return;
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
      return;
    }
  };
}
