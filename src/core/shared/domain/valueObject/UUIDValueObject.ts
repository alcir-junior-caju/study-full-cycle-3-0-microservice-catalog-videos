import { ValueObject } from "./ValueObject";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UUIDValueObject extends ValueObject {
  readonly value: string;
  constructor(value?: string) {
    super();
    this.value = value ?? uuidv4();
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUUIDError();
    }
  }

  toString(): string {
    return this.value;
  }
}

export class InvalidUUIDError extends Error {
  constructor(message?: string) {
    super(message ?? "ID must be a valid UUID");
    this.name = "InvalidUUIDError";
  }
}
