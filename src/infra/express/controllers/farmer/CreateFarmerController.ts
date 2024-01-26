import { Request, Response } from 'express';
import { FarmerRepository } from '../../../../application/repository/FarmerRepository.js';
import {
  CreateFarmer,
  FarmerProps,
} from '../../../../application/usecases/farmer/CreateFarmer.js';
import { Controller } from '../Controller.js';
import { HttpStatus } from '../HttpStatus.js';

export class CreateFarmerController implements Controller {
  constructor(private farmerRepository: FarmerRepository) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    try {
      const { id, name, CPF, CNPJ } = request.body as Partial<FarmerProps>;
      if (!name) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .send('Missing required parameter: "name"');
        return;
      }
      if (!CPF && !CNPJ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .send('Farmer needs to be created with either CPF or CNPJ');
        return;
      }
      const createFarmer = new CreateFarmer(this.farmerRepository);
      const farmerData = CPF ? { id, name, CPF } : { id, name, CNPJ: CNPJ! };
      const farmerIdOrError = await createFarmer.exec(farmerData);
      if (farmerIdOrError.isLeft()) {
        const error = farmerIdOrError.value;
        response.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }
      response.status(HttpStatus.CREATED).json({ id: farmerIdOrError.value });
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
