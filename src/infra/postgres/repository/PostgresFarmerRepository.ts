import {
  FarmerRepository,
  FarmerUpdate,
} from '../../../application/repository/FarmerRepository.js';
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

  async findById(id: string): Promise<Farmer | null> {
    const farmerDB = await FarmerModel.findByPk(id);
    if (!farmerDB) {
      return null;
    }
    return this.createFarmerFromDBData(farmerDB);
  }

  async list(): Promise<Farmer[]> {
    const farmersDB = await FarmerModel.findAll();
    return farmersDB.map((farmerDB) => this.createFarmerFromDBData(farmerDB));
  }

  async delete(id: string): Promise<Farmer | null> {
    const farmerDB = await FarmerModel.findByPk(id);
    if (!farmerDB) {
      return null;
    }
    await farmerDB.destroy();
    return this.createFarmerFromDBData(farmerDB);
  }

  async update(id: string, update: FarmerUpdate): Promise<boolean> {
    const updateResult = await FarmerModel.update(update, { where: { id } });
    return !!updateResult[0];
  }
}
