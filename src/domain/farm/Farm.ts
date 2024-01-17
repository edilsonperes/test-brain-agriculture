import { Either, left, right } from '../../shared/Either.js';
import { ID } from '../ID.js';
import { Name } from '../Name.js';

interface FarmInput {
  id?: string;
  name: string;
  state: string;
  city: string;
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
  ) {}

  static create({ id, name, state, city }: FarmInput): Either<Error, Farm> {
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
    if (state.length !== 2 || !stateList.includes(state.toUpperCase())) {
      return left(new Error(`Invalid state. Received: ${state}`));
    }

    const validId = idOrError.value;
    const validiName = nameOrError.value;
    return right(new Farm(validId, validiName, state.toUpperCase(), city));
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
}
