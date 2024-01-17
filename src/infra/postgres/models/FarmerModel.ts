import { db } from '../db.js';
import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { WithPartial } from '../../../shared/WithPartial.js';

interface FarmerAttributes {
  id: string;
  name: string;
  farm: string | null;
  CPF: string | null;
  CNPJ: string | null;
}

type FarmerCreationAttributes = WithPartial<
  FarmerAttributes,
  'CNPJ' | 'CPF' | 'farm' | 'id'
>;

export const FarmerModel = db.define<
  Model<FarmerAttributes, FarmerCreationAttributes>
>('farmer', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: randomUUID,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  farm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CPF: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CNPJ: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
