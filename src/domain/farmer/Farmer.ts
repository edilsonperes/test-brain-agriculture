import { Either, left, right } from '../../shared/Either.js';
import { WithPartial } from '../../shared/WithPartial.js';
import { ID } from '../ID.js';
import { Name } from '../Name.js';
import { CNPJ } from './CNPJ.js';
import { CPF } from './CPF.js';

interface BaseFarmer {
  id: string;
  name: string;
  // farm: string | Farm;
}

interface FarmerWithCPF extends BaseFarmer {
  cpf: string;
  cnpj?: undefined;
}

interface FarmerWithCNPJ extends BaseFarmer {
  cpf?: undefined;
  cnpj: string;
}

export class Farmer {
  private constructor(
    private _id: ID,
    private _name: Name,
    private _idDocument: CPF | CNPJ,
  ) {}

  static create({
    id,
    name,
    // farm,
    cpf,
    cnpj,
  }:
    | WithPartial<FarmerWithCPF, 'id'>
    | WithPartial<FarmerWithCNPJ, 'id'>): Either<Error, Farmer> {
    if (!cpf && !cnpj) {
      return left(new Error('Farmer needs either a valid CPF or CNPJ.'));
    }

    const idOrError = ID.create(id);
    const nameOrError = Name.create(name);
    const idDocumentOrError = cpf ? CPF.create(cpf) : CNPJ.create(cnpj!);

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

    const validId = idOrError.value;
    const validiName = nameOrError.value;
    const validIdDocument = idDocumentOrError.value;
    return right(new Farmer(validId, validiName, validIdDocument));
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
}
