import { FarmRepository } from '../../../application/repository/FarmRepository.js';
import { Farm } from '../../../domain/farm/Farm.js';
import { ID } from '../../../domain/ID.js';
import { FarmModel } from '../models/FarmModel.js';

export class PostgresFarmRepository implements FarmRepository {
  async create(farm: Farm): Promise<ID> {
    const farmDB = await FarmModel.create(farm.data);
    return ID.create(farmDB.dataValues.id).value as ID;
  }

  async findById(id: string): Promise<Farm | null> {
    const farmDB = await FarmModel.findByPk(id);
    if (!farmDB) {
      return null;
    }
    return Farm.create(farmDB.dataValues).value as Farm;
  }

  async list(): Promise<Farm[]> {
    const farmsDB = await FarmModel.findAll();
    return farmsDB.map(
      (farmDB) => Farm.create(farmDB.dataValues).value as Farm,
    );
  }

  async update(id: string, updatedFarm: Farm): Promise<boolean> {
    const { name, crops } = updatedFarm.data;
    const updateResult = await FarmModel.update(
      { name, crops },
      { where: { id } },
    );
    return !!updateResult[0];
  }

  async delete(id: string): Promise<Farm | null> {
    const farmDB = await FarmModel.findByPk(id);
    if (!farmDB) {
      return null;
    }
    await farmDB.destroy();
    return Farm.create(farmDB.dataValues).value as Farm;
  }

  async findAll(limit?: number, offset?: number): Promise<Farm[]> {
    const farmsDB = await FarmModel.findAll({ limit, offset });
    return farmsDB.map(
      (farmDB) => Farm.create(farmDB.dataValues).value as Farm,
    );
  }
}
