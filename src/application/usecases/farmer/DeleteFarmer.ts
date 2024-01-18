import { ID } from '../../../domain/ID.js';
import { FarmerData } from '../../../domain/farmer/Farmer.js';
import { Either, left, right } from '../../../shared/Either.js';
import { FarmerRepository } from '../../repository/FarmerRepository.js';
import { UseCase } from '../UseCase.js';

export class DeleteFarmer implements UseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async exec(id: string): Promise<Either<Error, FarmerData | null>> {
    const idOrError = ID.create(id);

    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    const validId = idOrError.value;
    const farmer = await this.farmerRepository.delete(validId.value);
    return right(farmer && farmer.data);
  }
}
