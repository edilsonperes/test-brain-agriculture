import { Either, left, right } from '../shared/Either.js';

export class Name {
  private constructor(private _value: string) {}

  static create(name: string): Either<Error, Name> {
    const invalidCharactersRegex = /[0-9+=!@#$%&*<>\\|/'"{}[\]]/;
    if (invalidCharactersRegex.test(name)) {
      return left(
        new Error(`Name cannot contain numbers or symbols. Received: ${name}`),
      );
    }
    if (name.length < 3 || name.length > 50) {
      return left(
        new Error(
          `Name too short or too long (min length: 3, max length: 50). \nReceived: ${name} \nLength: ${name.length}`,
        ),
      );
    }
    return right(new Name(name));
  }

  get value(): string {
    return this._value;
  }
}
