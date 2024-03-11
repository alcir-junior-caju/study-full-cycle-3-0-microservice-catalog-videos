import { FieldErrors } from "./ValidatorFieldsInterface";

export class ValidatorError extends Error {
  constructor(public error: FieldErrors[], message = "Entity Validation Error") {
    super(message);
  }

  count(): number {
    return Object.keys(this).length;
  }
}
