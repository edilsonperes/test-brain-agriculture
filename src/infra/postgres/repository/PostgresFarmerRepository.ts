import { FarmerRepository } from '../../../application/repository/FarmerRepository.js';
import { Farmer } from '../../../domain/farmer/Farmer.js';
import { ID } from '../../../domain/ID.js';
import { FarmerModelDefinition, FarmerModel } from '../models/FarmerModel.js';

export class PostgresFarmerRepository implements FarmerRepository {
  private createFarmerFromDBData(farmerDB: FarmerModelDefinition): Farmer {
    const { id, name, CPF, CNPJ, farm } = farmerDB.dataValues;
    const farmer = Farmer.create({
      id,
      name,
      ...(CPF && { CPF }),
      ...(CNPJ && { CNPJ }),
      ...(farm && { farm }),
    } as Parameters<typeof Farmer.create>[0]);
    return farmer.value as Farmer;
  }

  async create(farmer: Farmer): Promise<ID> {
    const farmerDB = await FarmerModel.create(farmer.data);
    return ID.create(farmerDB.dataValues.id).value as ID;
  }

  async findByPk(pk: string): Promise<Farmer[]> {
    const farmerDB = await FarmerModel.findByPk(pk);
    if (!farmerDB) {
      return [];
    }
    return [this.createFarmerFromDBData(farmerDB)];
  }

  async list(): Promise<Farmer[]> {
    const farmersDB = await FarmerModel.findAll();
    return farmersDB.map((farmerDB) => this.createFarmerFromDBData(farmerDB));
  }
}
