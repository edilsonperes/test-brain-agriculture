import { ID } from '../../../domain/ID.js';
import { Farmer, FarmerData } from '../../../domain/farmer/Farmer.js';
import { Either, left, right } from '../../../shared/Either.js';
import {
  FarmerRepository,
  FarmerUpdate,
} from '../../repository/FarmerRepository.js';
import { UseCase } from '../UseCase.js';

export class UpdateFarmer implements UseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async exec(
    id: string,
    { name, farm }: FarmerUpdate,
  ): Promise<Either<Error, FarmerData | null>> {
    const idOrError = ID.create(id);
    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    const validId = idOrError.value;
    const farmer = await this.farmerRepository.findById(validId.value);
    if (!farmer) {
      return right(null);
    }

    let updatedFarmerOrError: Either<Error, Farmer>;
    if (name) {
      updatedFarmerOrError = farmer.updateName(name);
      if (updatedFarmerOrError.isLeft()) {
        const error = updatedFarmerOrError.value;
        return left(error);
      }
    }
    if (farm !== undefined) {
      updatedFarmerOrError = farm
        ? farmer.assignFarm(farm)
        : farmer.removeFarm();
      if (updatedFarmerOrError.isLeft()) {
        const error = updatedFarmerOrError.value;
        return left(error);
      }
    }
    await this.farmerRepository.update(validId.value, {
      name: farmer.name,
      farm: farmer.farm,
    });
    return right(farmer.data);
  }
}
