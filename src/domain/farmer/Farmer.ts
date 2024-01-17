import { Either, left, right } from '../../shared/Either.js';
import { WithPartial } from '../../shared/WithPartial.js';
import { ID } from '../ID.js';
import { Name } from '../Name.js';
import { CNPJ } from './CNPJ.js';
import { CPF } from './CPF.js';

interface BaseFarmer {
  id: string;
  name: string;
  farm?: string;
}

export interface FarmerWithCPF extends BaseFarmer {
  CPF: string;
  CNPJ?: undefined;
}

export interface FarmerWithCNPJ extends BaseFarmer {
  CPF?: undefined;
  CNPJ: string;
}

export class Farmer {
  private constructor(
    private readonly _id: ID,
    private _name: Name,
    private readonly _idDocument: CPF | CNPJ,
    private _farm: ID | undefined,
  ) {}

  static create({
    id,
    name,
    CPF: cpf,
    CNPJ: cnpj,
    farm,
  }:
    | WithPartial<FarmerWithCPF, 'id'>
    | WithPartial<FarmerWithCNPJ, 'id'>): Either<Error, Farmer> {
    if (!cpf && !cnpj) {
      return left(new Error('Farmer needs either a valid CPF or CNPJ.'));
    }

    const idOrError = ID.create(id);
    const nameOrError = Name.create(name);
    const idDocumentOrError = cpf ? CPF.create(cpf) : CNPJ.create(cnpj!);
    const farmIdOrError = ID.create(farm);

    if (idOrError.isLeft()) {
      const error = idOrError.value;
      return left(error);
    }
    if (nameOrError.isLeft()) {
      const error = nameOrError.value;
      return left(error);
    }
    if (idDocumentOrError.isLeft()) {
      const error = idDocumentOrError.value;
      return left(error);
    }
    if (farmIdOrError.isLeft()) {
      const error = farmIdOrError.value;
      return left(error);
    }

    const validId = idOrError.value;
    const validiName = nameOrError.value;
    const validIdDocument = idDocumentOrError.value;
    const validFarmId = farmIdOrError.value;
    return right(
      new Farmer(
        validId,
        validiName,
        validIdDocument,
        farm ? validFarmId : undefined,
      ),
    );
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name.value;
  }

  get CPF(): string | null {
    return this._idDocument instanceof CPF ? this._idDocument.value : null;
  }

  get CNPJ(): string | null {
    return this._idDocument instanceof CNPJ ? this._idDocument.value : null;
  }

  get farm(): string | null {
    return this._farm ? this._farm.value : null;
  }

  get data() {
    return {
      id: this.id,
      name: this.name,
      CPF: this.CPF,
      CNPJ: this.CNPJ,
      farm: this.farm,
    };
  }

  updateName(name: string): Either<Error, Farmer> {
    const nameOrError = Name.create(name);
    if (nameOrError.isLeft()) {
      const error = nameOrError.value;
      return left(error);
    }
    const validiName = nameOrError.value;
    this._name = validiName;
    return right(this);
  }

  updateFarm(farm: string): Either<Error, Farmer> {
    const farmIdOrError = ID.create(farm);
    if (farmIdOrError.isLeft()) {
      const error = farmIdOrError.value;
      return left(error);
    }
    const validFarmId = farmIdOrError.value;
    this._farm = validFarmId;
    return right(this);
  }
}
