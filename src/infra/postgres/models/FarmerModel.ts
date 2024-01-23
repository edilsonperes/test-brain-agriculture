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

export type FarmerModelDefinition = Model<
  FarmerAttributes,
  FarmerCreationAttributes
>;

export const FarmerModel = db.define<FarmerModelDefinition>('farmer', {
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
    unique: true,
  },
  CPF: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  CNPJ: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});
