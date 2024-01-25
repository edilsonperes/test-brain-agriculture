import { UUID, randomUUID } from 'node:crypto';
import { Either, left, right } from '../shared/Either.js';

export class ID {
  private readonly _value: UUID;

  private constructor(id: UUID) {
    this._value = id;
  }

  static create(id?: string): Either<Error, ID> {
    if (id === undefined) {
      return right(new ID(randomUUID()));
    }
    if (!ID._validate(id)) {
      return left(new Error(`Invalid id. Received: '${id}'.`));
    }
    return right(new ID(id));
  }

  static _validate(id: string): id is UUID {
    const validator =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return validator.test(id);
  }

  get value(): UUID {
    return this._value;
  }
}
