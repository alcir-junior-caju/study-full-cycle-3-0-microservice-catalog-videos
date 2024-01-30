import { ValueObject } from "../domain";

class SimpleValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value: string, readonly value2: number) {
    super();
  }
}

describe('ValueObject Tests', () => {
  it('should be equals simple value object', () => {
    const valueObject1 = new SimpleValueObject("test");
    const valueObject2 = new SimpleValueObject("test");
    expect(valueObject1.equals(valueObject2)).toBeTruthy();
  });

  it('should be equals complex value object', () => {
    const valueObject1 = new ComplexValueObject("test", 1);
    const valueObject2 = new ComplexValueObject("test", 1);
    expect(valueObject1.equals(valueObject2)).toBeTruthy();
  });

  it('should not be equals simple value object', () => {
    const valueObject1 = new SimpleValueObject("test");
    const valueObject2 = new SimpleValueObject("test2");
    expect(valueObject1.equals(valueObject2)).toBeFalsy();
  });

  it('should not be equals complex value object', () => {
    const valueObject1 = new ComplexValueObject("test", 1);
    const valueObject2 = new ComplexValueObject("test", 2);
    expect(valueObject1.equals(valueObject2)).toBeFalsy();
  });

  it('should not be equals null', () => {
    const valueObject1 = new SimpleValueObject("test");
    expect(valueObject1.equals(null as any)).toBeFalsy();
  });

  it('should not be equals undefined', () => {
    const valueObject1 = new SimpleValueObject("test");
    expect(valueObject1.equals(undefined as any)).toBeFalsy();
  });
});
