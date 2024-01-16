import { UUID, randomUUID } from 'node:crypto';
import { Either, left, right } from '../shared/Either.js';

export class ID {
  private _id: UUID;

  private constructor(id: UUID) {
    this._id = id;
  }

  static create(id?: string): Either<Error, ID> {
    if (!id) {
      return right(new ID(randomUUID()));
    }
    if (!ID._validate(id)) {
      return left(new Error(`Invalid id. Received: ${id}`));
    }
    return right(new ID(id));
  }

  static _validate(id: string): id is UUID {
    const validator =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{8}/;
    return validator.test(id);
  }

  get value(): UUID {
    return this._id;
  }
}
