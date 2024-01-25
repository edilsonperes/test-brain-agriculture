import { ID } from '../../../domain/ID.js';
import { FarmData } from '../../../domain/farm/Farm.js';
import { FarmerData } from '../../../domain/farmer/Farmer.js';
import { Either, left, right } from '../../../shared/Either.js';
import { FarmRepository } from '../../repository/FarmRepository.js';
import { FarmerRepository } from '../../repository/FarmerRepository.js';
import { UseCase } from '../UseCase.js';
import { ListFarms } from '../farm/ListFarms.js';

type FarmerWithPopulatedFarm = Omit<FarmerData, 'farm'> & {
  farm: FarmData | null;
};

export class ListFarmers implements UseCase {
  constructor(
    private farmerRepository: FarmerRepository,
    private farmRepository: FarmRepository,
  ) {}

  private async populateFarm(
    farmerData: FarmerData,
  ): Promise<Either<Error, FarmerWithPopulatedFarm>> {
    if (!farmerData.farm) {
      return right(farmerData as FarmerWithPopulatedFarm);
    }
    const listFarms = new ListFarms(this.farmRepository);
    const farmId = farmerData.farm;
    const farmOrError = await listFarms.exec(farmId);
    if (farmOrError.isLeft()) {
      const error = farmOrError.value;
      return left(error);
    }
    const farm = farmOrError.value[0];
    if (!farm) {
      const error = new Error(
        `Farm not found. Farm: '${farmId}' | Farmer: '${farmerData.id}'`,
      );
      return left(error);
    }
    return right({ ...farmerData, farm });
  }

  async exec(id?: string): Promise<Either<Error, FarmerWithPopulatedFarm[]>> {
    if (!id) {
      const farmers = await this.farmerRepository.list();
      const farmerDataOrErrors = await Promise.all(
        farmers.map((farmer) => this.populateFarm(farmer.data)),
      );
      const errorItem = farmerDataOrErrors.find((item) => item.isLeft());
      if (errorItem) {
        const error = errorItem.value as Error;
        return left(error);
      }
      const farmerData = farmerDataOrErrors.map(
        (item) => item.value as FarmerWithPopulatedFarm,
      );
      return right(farmerData);
    }

    const idOrError = ID.create(id);
    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    const validId = idOrError.value;
    const farmer = await this.farmerRepository.findById(validId.value);
    if (!farmer) {
      return right([]);
    }
    const farmerDataOrError = await this.populateFarm(farmer.data);
    if (farmerDataOrError.isLeft()) {
      const error = farmerDataOrError.value;
      return left(error);
    }
    const farmerData = farmerDataOrError.value;
    return right([farmerData]);
  }
}
