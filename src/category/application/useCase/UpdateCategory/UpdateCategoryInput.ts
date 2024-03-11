import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export type UpdateCategoryInputParams = {
  id: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(params?: UpdateCategoryInputParams) {
    if (!params) return;
    this.id = params.id;
    params.name && (this.name = params.name);
    params.description && (this.description = params.description);
    params.isActive !== null &&
    params.isActive !== undefined &&
      (this.isActive = params.isActive);
  }
}

export class ValidateUpdateCategoryInput {
  static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
