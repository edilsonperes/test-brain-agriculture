import { ID } from '../../domain/ID.js';
import { Farm } from '../../domain/farm/Farm.js';

export interface FarmRepository {
  create(farm: Farm): Promise<ID>;
  findById(id: string): Promise<Farm | null>;
  list(): Promise<Farm[]>;
  update(id: string, updatedFarm: Farm): Promise<boolean>;
  delete(id: string): Promise<Farm | null>;
}
