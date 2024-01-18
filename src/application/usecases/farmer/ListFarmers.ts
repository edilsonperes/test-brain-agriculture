import { ID } from '../../../domain/ID.js';
import { Farmer } from '../../../domain/farmer/Farmer.js';
import { Either, left, right } from '../../../shared/Either.js';
import { FarmerRepository } from '../../repository/FarmerRepository.js';
import { UseCase } from '../UseCase.js';

export class ListFarmers implements UseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async exec(id?: string): Promise<Either<Error, Farmer[]>> {
    if (!id) {
      return right(await this.farmerRepository.list());
    }
    const idOrError = ID.create(id);

    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    return right(await this.farmerRepository.findByPk(id));
  }
}
