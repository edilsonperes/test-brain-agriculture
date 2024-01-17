import { Either, left, right } from '../../shared/Either.js';

export class CNPJ {
  private readonly _value: string;

  private constructor(cnpj: string) {
    this._value = cnpj;
  }

  static create(cnpj: string): Either<Error, CNPJ> {
    const formattedCnpj = cnpj.trim().replaceAll(/\.|-|\//g, '');
    if (!CNPJ._validate(formattedCnpj)) {
      return left(new Error(`Invalid CNPJ. Received ${cnpj}`));
    }
    return right(new CNPJ(formattedCnpj));
  }

  static _validate(cnpj: string): boolean {
    const length = 14;
    const formatValidator = new RegExp(`^[0-9]{${length}}$`);
    if (!formatValidator.test(cnpj)) {
      return false;
    }

    const firstCharacter = cnpj.charAt(0);
    const repetedDigitsMatcher = new RegExp(`^${firstCharacter}{${length}}$`);
    if (repetedDigitsMatcher.test(cnpj)) {
      return false;
    }

    const validateVerificationDigitAt = (pos: 12 | 13) => {
      const validatorDigit = cnpj.charAt(pos);
      let multiplier = pos - 7;
      const sum = cnpj
        .slice(0, pos)
        .split('')
        .map((v) => {
          if (multiplier < 2) {
            multiplier = 9;
          }
          return parseInt(v) * multiplier--;
        })
        .reduce((acc, curr) => acc + curr);
      const remainder = sum % 11;
      const result = remainder >= 2 ? 11 - remainder : 0;
      return parseInt(validatorDigit) === result;
    };
    const isFirstVerificationDigitValid = validateVerificationDigitAt(12);
    const isSecondVerificationDigitValid = validateVerificationDigitAt(13);

    return isFirstVerificationDigitValid && isSecondVerificationDigitValid;
  }

  get value(): string {
    return this._value;
  }
}
