import { ID } from '../../domain/ID.js';
import { Farmer } from '../../domain/farmer/Farmer.js';

export interface FarmerRepository {
  create(farmer: Farmer): Promise<ID>;
}
