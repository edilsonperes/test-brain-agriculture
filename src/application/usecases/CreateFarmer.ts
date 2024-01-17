import {
  Farmer,
  FarmerWithCNPJ,
  FarmerWithCPF,
} from '../../domain/farmer/Farmer.js';
import { Either, left, right } from '../../shared/Either.js';
import { WithPartial } from '../../shared/WithPartial.js';
import { FarmerRepository } from '../repository/FarmerRepository.js';
import { UseCase } from './UseCase.js';

export type FarmerProps =
  | WithPartial<FarmerWithCPF, 'id'>
  | WithPartial<FarmerWithCNPJ, 'id'>;

export class CreateFarmer implements UseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async exec(props: FarmerProps): Promise<Either<Error, string>> {
    const farmerOrError = Farmer.create(props);
    if (farmerOrError.isLeft()) {
      const error = farmerOrError.value;
      return left(error);
    }
    const farmer = farmerOrError.value;
    try {
      const id = await this.farmerRepository.create(farmer);
      return right(id.value);
    } catch (error: unknown) {
      return left(error as Error);
    }
  }
}
