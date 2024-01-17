import { FarmerRepository } from '../../../application/repository/FarmerRepository.js';
import { Farmer } from '../../../domain/farmer/Farmer.js';
import { ID } from '../../../domain/ID.js';
import { FarmerModel } from '../models/FarmerModel.js';

export class PostgresFarmerRepository implements FarmerRepository {
  async create(farmer: Farmer): Promise<ID> {
    const farmerDB = await FarmerModel.create(farmer.data);
    return ID.create(farmerDB.dataValues.id).value as ID;
  }
}
