import { validateSync } from "class-validator";
import { FieldErrors, ValidatorFieldsInterface } from "./ValidatorFieldsInterface";

export abstract class ValidatorFields<ParamsValidated> implements ValidatorFieldsInterface<ParamsValidated> {
  errors: FieldErrors | null = null;
  validatedData: any = null;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints!);
      }
    } else {
      this.validatedData = data;
    }
    return !errors.length;
  }
}
