import { ID } from '../../../domain/ID.js';
import { FarmData } from '../../../domain/farm/Farm.js';
import { Either, left, right } from '../../../shared/Either.js';
import { FarmRepository } from '../../repository/FarmRepository.js';
import { UseCase } from '../UseCase.js';

export class DeleteFarm implements UseCase {
  constructor(private farmRepository: FarmRepository) {}

  async exec(id: string): Promise<Either<Error, FarmData | null>> {
    const idOrError = ID.create(id);
    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    const validId = idOrError.value;
    const farm = await this.farmRepository.delete(validId.value);
    return right(farm && farm.data);
  }
}
