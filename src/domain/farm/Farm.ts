import { Either, left, right } from '../../shared/Either.js';
import { WithPartial } from '../../shared/WithPartial.js';
import { ID } from '../ID.js';
import { Name } from '../Name.js';
import { Crop } from './Crop.js';

export interface FarmData {
  id: string;
  name: string;
  state: string;
  city: string;
  arableArea: number;
  vegetationArea: number;
  totalArea: number;
  crops: string[];
}

export const stateList = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export class Farm {
  private constructor(
    private readonly _id: ID,
    private _name: Name,
    private readonly _state: string,
    private readonly _city: string,
    private readonly _totalArea: number,
    private readonly _arableArea: number,
    private readonly _vegetationArea: number,
    private _crops: Crop[],
  ) {}

  static create({
    id,
    name,
    state,
    city,
    arableArea,
    vegetationArea,
    totalArea,
    crops,
  }: WithPartial<FarmData, 'id' | 'crops'>): Either<Error, Farm> {
    const idOrError = ID.create(id);
    const nameOrError = Name.create(name);
    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    if (nameOrError.isLeft()) {
      const error = nameOrError.value;
      return left(error);
    }

    const formattedState = state.toUpperCase();
    if (state.length !== 2 || !stateList.includes(formattedState)) {
      return left(new Error(`Invalid state. Received: ${state}`));
    }

    if (arableArea < 0 || vegetationArea < 0 || totalArea < 0) {
      return left(new Error('Area values cannot be negative numbers.'));
    }
    if (!(totalArea > 0)) {
      return left(new Error('Farm area cannot be null.'));
    }
    if (!(arableArea > 0) || !(vegetationArea > 0)) {
      return left(
        new Error(
          'Either arable area or vegetation area must be greater than 0.',
        ),
      );
    }
    if (arableArea + vegetationArea > totalArea) {
      return left(
        new Error('The sum of partial areas cannot exceed the total area.'),
      );
    }

    const cropsSet = Array.from(new Set(crops));
    const cropsOrError = cropsSet.map((crop) => Crop.create(crop));
    const cropError = cropsOrError.find((item) => item.isLeft());
    if (cropError) {
      const error = cropError.value as Error;
      return left(error);
    }

    const validId = idOrError.value;
    const validiName = nameOrError.value;
    const validCrops = cropsOrError.map((item) => item.value as Crop);
    return right(
      new Farm(
        validId,
        validiName,
        formattedState,
        city,
        arableArea,
        vegetationArea,
        totalArea,
        validCrops,
      ),
    );
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name.value;
  }

  get state(): string {
    return this._state;
  }

  get city(): string {
    return this._city;
  }

  get arableArea(): number {
    return this._arableArea;
  }

  get vegetationArea(): number {
    return this._vegetationArea;
  }

  get totalArea(): number {
    return this._totalArea;
  }

  get crops(): string[] {
    return this._crops.map((crop) => crop.value);
  }

  get data(): FarmData {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      city: this.city,
      arableArea: this.arableArea,
      vegetationArea: this.vegetationArea,
      totalArea: this.totalArea,
      crops: this.crops,
    };
  }

  updateName(name: string): Either<Error, Farm> {
    const nameOrError = Name.create(name);
    if (nameOrError.isLeft()) {
      const error = nameOrError.value;
      return left(error);
    }
    const validiName = nameOrError.value;
    this._name = validiName;
    return right(this);
  }

  addCrop(crop: string): Either<Error, Farm> {
    const cropsSet = Array.from(new Set([crop, ...this.crops]));
    const cropsOrError = cropsSet.map((cropItem) => Crop.create(cropItem));
    const cropError = cropsOrError.find((item) => item.isLeft());
    if (cropError) {
      const error = cropError.value as Error;
      return left(error);
    }
    const validCrops = cropsOrError.map((item) => item.value as Crop);
    this._crops = validCrops;
    return right(this);
  }

  removeCrop(crop: string): Either<Error, Farm> {
    const existingCrops = this.crops;
    if (!existingCrops.includes(crop)) {
      return left(new Error(`Crop '${crop}' doesn't exist in this farm.`));
    }
    existingCrops.splice(existingCrops.indexOf(crop), 1);
    const cropsOrError = existingCrops.map((cropItem) => Crop.create(cropItem));
    const validCrops = cropsOrError.map((item) => item.value as Crop);
    this._crops = validCrops;
    return right(this);
  }
}
