import { Either, left, right } from '../../shared/Either.js';

export class CPF {
  private readonly _value: string;

  private constructor(cpf: string) {
    this._value = cpf;
  }

  static create(cpf: string): Either<Error, CPF> {
    const formattedCpf = cpf.trim().replaceAll(/\.|-/g, '');
    if (!CPF._validate(formattedCpf)) {
      return left(new Error(`Invalid CPF. Received: ${cpf}`));
    }
    return right(new CPF(formattedCpf));
  }

  static _validate(cpf: string): boolean {
    const length = 11;
    const formatValidator = new RegExp(`^[0-9]{${length}}$`);
    if (!formatValidator.test(cpf)) {
      return false;
    }

    const firstCharacter = cpf.charAt(0);
    const repetedDigitsMatcher = new RegExp(`^${firstCharacter}{${length}}$`);
    if (repetedDigitsMatcher.test(cpf)) {
      return false;
    }

    const validateVerificationDigitAt = (pos: 9 | 10) => {
      const validatorDigit = cpf.charAt(pos);
      const sum = cpf
        .slice(0, pos)
        .split('')
        .map((v, i) => parseInt(v) * (pos + 1 - i))
        .reduce((acc, curr) => acc + curr);
      const remainder = sum % 11;
      const result = remainder >= 2 ? 11 - remainder : 0;
      return parseInt(validatorDigit) === result;
    };
    const isFirstVerificationDigitValid = validateVerificationDigitAt(9);
    const isSecondVerificationDigitValid = validateVerificationDigitAt(10);

    return isFirstVerificationDigitValid && isSecondVerificationDigitValid;
  }

  get value(): string {
    return this._value;
  }
}
