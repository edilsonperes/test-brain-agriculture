import { Farm, FarmData } from '../../../domain/farm/Farm.js';
import { Either, left, right } from '../../../shared/Either.js';
import { WithPartial } from '../../../shared/WithPartial.js';
import { FarmRepository } from '../../repository/FarmRepository.js';
import { UseCase } from '../UseCase.js';

export type FarmProps =
  | WithPartial<FarmData, 'id' | 'crops'>
  | WithPartial<FarmData, 'id' | 'crops' | 'arableArea'>
  | WithPartial<FarmData, 'id' | 'crops' | 'vegetationArea'>;

export class CreateFarm implements UseCase {
  constructor(private farmRepository: FarmRepository) {}

  async exec(props: FarmProps): Promise<Either<Error, string>> {
    const { arableArea, vegetationArea } = props;
    if (!arableArea && !vegetationArea) {
      return left(
        new Error('Either arable area or vegetation area must be provided.'),
      );
    }
    const farmOrError = Farm.create({
      ...props,
      arableArea: arableArea ?? 0,
      vegetationArea: vegetationArea ?? 0,
    });
    if (farmOrError.isLeft()) {
      const error = farmOrError.value;
      return left(error);
    }
    const farm = farmOrError.value;
    const id = await this.farmRepository.create(farm);
    return right(id.value);
  }
}
