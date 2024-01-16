import { Farmer } from '../../../../src/domain/farmer/Farmer.js';

describe('Farmer entity', () => {
  describe('should not create farmer with invalid id', () => {
    const testCases: [string][] = [
      ['a'],
      ['12345'],
      ['1-2-3-4-5'],
      // id containing a not hex character
      ['k3aa0f8c-51b5-4ecd-a5c4-cf46dd465bf8'],
    ];

    it.each(testCases)('given %p', (id) => {
      const fakeName = 'John Doe';
      const fakeCpf = '111.444.777-35';
      const farmerOrError = Farmer.create({ id, name: fakeName, cpf: fakeCpf });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should not create farmer with invalid name', () => {
    const testCases: [string][] = [
      [''],
      ['a'],
      ['Su'],
      ['John@'],
      ['John1'],
      [Array.from({ length: 51 }, () => 'a').join('')],
    ];

    it.each(testCases)('given %p', (name) => {
      const fakeCpf = '111.444.777-35';
      const farmerOrError = Farmer.create({ name, cpf: fakeCpf });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should not create farmer with invalid CPF', () => {
    const testCases: [string][] = [
      ['123'],
      ['abc'],
      ['123.456.789-ab'],
      ['01234567890123456789'],
      ['111.111.111-11'],
      ['111.444.777-05'],
      ['111.444.777-30'],
    ];

    it.each(testCases)('given %p', (cpf) => {
      const fakeName = 'John Doe';
      const farmerOrError = Farmer.create({ name: fakeName, cpf });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should not create farmer with invalid CNPJ', () => {
    const testCases: [string][] = [
      ['123'],
      ['abc'],
      ['123.456.789/00ab-00'],
      ['01234567890123456789'],
      ['11.111.111/1111-11'],
      ['11.444.777/0001-01'],
      ['11.444.777/0001-60'],
    ];

    it.each(testCases)('given %p', (cnpj) => {
      const fakeName = 'John Doe';
      const farmerOrError = Farmer.create({ name: fakeName, cnpj });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should create farmer with valid properties', () => {
    const testCases: [string | undefined, string | undefined, string][] = [
      ['111.444.777-35', undefined, '11144477735'],
      [undefined, '11.444.777/0001-61', '11444777000161'],
    ];

    it.each(testCases)('given CPF: %p | CNPJ: %p', (cpf, cnpj, expected) => {
      const fakeName = 'John Doe';
      const fakeData = cpf ? { name: fakeName, cpf } : { name: fakeName, cnpj };
      const farmerOrError = Farmer.create(fakeData);
      const farmer = farmerOrError.value as Farmer;

      expect(farmer).toBeInstanceOf(Farmer);
      expect(farmer.id).toBeDefined();
      expect(farmer.name).toEqual(fakeName);
      expect(farmer.CPF || farmer.CNPJ).toEqual(expected);
    });
  });

  it('should not create farmer with no id document', () => {
    const fakeName = 'John Doe';
    const farmerOrError = Farmer.create({ name: fakeName } as Parameters<
      typeof Farmer.create
    >[0]);

    expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
  });
});
