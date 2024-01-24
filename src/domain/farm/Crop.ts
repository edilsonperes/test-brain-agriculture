import { Either, left, right } from '../../shared/Either.js';

const cropList: Readonly<string[]> = [
  'soy',
  'corn',
  'cotton',
  'coffe',
  'sugarcane',
];

export class Crop {
  private constructor(private readonly _value: string) {}

  static create(crop: string): Either<Error, Crop> {
    if (!cropList.includes(crop)) {
      return left(new Error(`Invalid crop. Received ${crop}.`));
    }
    return right(new Crop(crop));
  }

  get value(): string {
    return this._value;
  }
}
