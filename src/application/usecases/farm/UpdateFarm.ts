import { ID } from '../../../domain/ID.js';
import { FarmData } from '../../../domain/farm/Farm.js';
import { Either, left, right } from '../../../shared/Either.js';
import { FarmRepository } from '../../repository/FarmRepository.js';
import { UseCase } from '../UseCase.js';

export interface FarmUpdate {
  crop: string;
  action: 'add' | 'remove';
}

export class UpdateFarm implements UseCase {
  constructor(private farmRepository: FarmRepository) {}

  async exec(
    id: string,
    updates: FarmUpdate[],
  ): Promise<Either<Error, FarmData | null>> {
    const idOrError = ID.create(id);
    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    const validId = idOrError.value;
    const farm = await this.farmRepository.findById(validId.value);
    if (!farm) {
      return right(null);
    }

    for (const { action, crop } of updates) {
      const farmOrError =
        action === 'add' ? farm.addCrop(crop) : farm.removeCrop(crop);
      if (farmOrError.isLeft()) {
        const error = farmOrError.value;
        return left(error);
      }
    }

    await this.farmRepository.update(validId.value, farm);
    return right(farm.data);
  }
}
