import { InvalidUUIDError, UUIDValueObject } from "../domain";

describe('UUIDValueObject Tests', () => {
  const validateSpy = jest.spyOn(UUIDValueObject.prototype as any, "validate");

  it('should be throw error when uuid is invalid', () => {
    expect(() => {
      new UUIDValueObject("invalid-uuid");
      expect(validateSpy).toHaveBeenCalledTimes(1);
    }).toThrow(new InvalidUUIDError());
  });

  it('should be generate uuid when value is undefined', () => {
    const uuid = new UUIDValueObject();
    expect(uuid.value).toBeDefined();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should be generate uuid when value is null', () => {
    const uuid = new UUIDValueObject(null as any);
    expect(uuid.value).toBeDefined();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should be generate uuid when value is valid', () => {
    const uuid = new UUIDValueObject("d1d7d4e2-4c3f-4a1a-9a2e-8e6e2d2c3a3f");
    expect(uuid.value).toBe("d1d7d4e2-4c3f-4a1a-9a2e-8e6e2d2c3a3f");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should be equals uuid value object', () => {
    const uuid1 = new UUIDValueObject("d1d7d4e2-4c3f-4a1a-9a2e-8e6e2d2c3a3f");
    const uuid2 = new UUIDValueObject("d1d7d4e2-4c3f-4a1a-9a2e-8e6e2d2c3a3f");
    expect(uuid1.equals(uuid2)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });
});
