import { db } from '../db.js';
import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { WithPartial } from '../../../shared/WithPartial.js';

interface FarmAttributes {
  id: string;
  name: string;
  state: string;
  city: string;
  arableArea: number;
  vegetationArea: number;
  totalArea: number;
  crops: string[];
}

type FarmCreationAttributes = WithPartial<FarmAttributes, 'id' | 'crops'>;

export type FarmModelDefinition = Model<FarmAttributes, FarmCreationAttributes>;

export const FarmModel = db.define<FarmModelDefinition>('farm', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: randomUUID,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arableArea: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vegetationArea: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalArea: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  crops: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
});
