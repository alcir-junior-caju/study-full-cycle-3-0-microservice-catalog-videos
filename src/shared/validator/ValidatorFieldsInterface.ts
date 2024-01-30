export type FieldErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<ParamsValidated> {
  errors: FieldErrors | null;
  validatedData: ParamsValidated | null;
  validate(data: any): boolean;
}
