import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";

export type CreateCategoryInputParams = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(params?: CreateCategoryInputParams) {
    if (!params) return;
    this.name = params.name;
    this.description = params.description;
    this.isActive = params.isActive;
  }
}

export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInputParams) {
    return validateSync(input);
  }
}
