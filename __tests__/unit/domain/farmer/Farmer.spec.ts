import { Farmer } from '../../../../src/domain/farmer/Farmer.js';

describe('Farmer entity', () => {
  describe('should not create farmer with invalid id', () => {
    const testCases: [string][] = [
      [''],
      ['a'],
      ['12345'],
      ['1-2-3-4-5'],
      // id containing a not hex character
      ['k3aa0f8c-51b5-4ecd-a5c4-cf46dd465bf8'],
    ];

    it.each(testCases)('given %p', (id) => {
      const fakeName = 'John Doe';
      const fakeCpf = '111.444.777-35';
      const farmerOrError = Farmer.create({ id, name: fakeName, CPF: fakeCpf });

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
      const farmerOrError = Farmer.create({ name, CPF: fakeCpf });

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

    it.each(testCases)('given %p', (CPF) => {
      const fakeName = 'John Doe';
      const farmerOrError = Farmer.create({ name: fakeName, CPF });

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

    it.each(testCases)('given %p', (CNPJ) => {
      const fakeName = 'John Doe';
      const farmerOrError = Farmer.create({ name: fakeName, CNPJ });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should not create farmer with invalid farm', () => {
    const testCases: [string][] = [
      ['a'],
      ['12345'],
      ['1-2-3-4-5'],
      // id containing a not hex character
      ['k3aa0f8c-51b5-4ecd-a5c4-cf46dd465bf8'],
    ];

    it.each(testCases)('given %p', (farm) => {
      const fakeName = 'John Doe';
      const fakeCpf = '111.444.777-35';
      const farmerOrError = Farmer.create({
        name: fakeName,
        CPF: fakeCpf,
        farm,
      });

      expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
    });
  });

  describe('should create farmer with valid properties', () => {
    const testCases: [string | undefined, string | undefined, string][] = [
      ['111.444.777-35', undefined, '11144477735'],
      [undefined, '11.444.777/0001-61', '11444777000161'],
    ];

    it.each(testCases)('given CPF: %p | CNPJ: %p', (CPF, CNPJ, expected) => {
      const fakeName = 'John Doe';
      const fakeFarmId = 'f40b6e6d-4d4e-4611-9f0e-117e33aa7d2c';
      const fakeData = CPF
        ? { name: fakeName, CPF, farm: fakeFarmId }
        : { name: fakeName, CNPJ: CNPJ!, farm: fakeFarmId };
      const farmerOrError = Farmer.create(fakeData);
      const farmer = farmerOrError.value as Farmer;

      expect(farmer).toBeInstanceOf(Farmer);
      expect(farmer.id).toBeDefined();
      expect(farmer.name).toEqual(fakeName);
      expect(farmer.CPF || farmer.CNPJ).toEqual(expected);
      expect(farmer.farm).toEqual(fakeFarmId);
    });
  });

  it('should not create farmer with no id document', () => {
    const fakeName = 'John Doe';
    const farmerOrError = Farmer.create({ name: fakeName } as Parameters<
      typeof Farmer.create
    >[0]);

    expect(farmerOrError.value).not.toBeInstanceOf(Farmer);
  });

  it("sould allow to update farmer's name", () => {
    const fakeName = 'John Doe';
    const fakeCpf = '111.444.777-35';
    const farmerOrError = Farmer.create({ name: fakeName, CPF: fakeCpf });
    const farmer = farmerOrError.value as Farmer;

    const newName = 'John Roe';
    const updatedFarmerOrError = farmer.updateName(newName);
    const updatedFarmer = updatedFarmerOrError.value as Farmer;

    expect(updatedFarmer.name).toEqual(newName);
  });

  it('sould allow to assign farm', () => {
    const fakeName = 'John Doe';
    const fakeCpf = '111.444.777-35';
    const farmerOrError = Farmer.create({ name: fakeName, CPF: fakeCpf });
    const farmer = farmerOrError.value as Farmer;

    const fakeFarm = 'a007e99a-6d61-440d-bd2d-8021f5e8cdcc';
    const updatedFarmerOrError = farmer.assignFarm(fakeFarm);
    const updatedFarmer = updatedFarmerOrError.value as Farmer;

    expect(updatedFarmer.farm).toEqual(fakeFarm);
  });

  describe('sould allow to update farm', () => {
    const testCases: [string | undefined][] = [
      [undefined],
      ['f40b6e6d-4d4e-4611-9f0e-117e33aa7d2c'],
    ];

    it.each(testCases)('given initial farm id %p', (farm) => {
      const fakeName = 'John Doe';
      const fakeCpf = '111.444.777-35';
      const farmerOrError = Farmer.create({
        name: fakeName,
        CPF: fakeCpf,
        ...(farm && { farm }),
      });
      const farmer = farmerOrError.value as Farmer;

      const newFarm = 'a007e99a-6d61-440d-bd2d-8021f5e8cdcc';
      const updatedFarmerOrError = farmer.assignFarm(newFarm);
      const updatedFarmer = updatedFarmerOrError.value as Farmer;

      expect(updatedFarmer.farm).toEqual(newFarm);
    });
  });

  it('sould allow to remove farm', () => {
    const fakeName = 'John Doe';
    const fakeCpf = '111.444.777-35';
    const fakeFarm = 'a007e99a-6d61-440d-bd2d-8021f5e8cdcc';
    const farmerOrError = Farmer.create({
      name: fakeName,
      CPF: fakeCpf,
      farm: fakeFarm,
    });
    const farmer = farmerOrError.value as Farmer;

    const updatedFarmer = farmer.removeFarm().value;

    expect(updatedFarmer.farm).toEqual(null);
  });
});
