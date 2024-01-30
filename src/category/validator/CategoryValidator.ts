import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CategoryEntity } from "../domain";
import { ValidatorFields } from "../../shared";

export class CategoryValidator extends ValidatorFields<CategoryRules> {
  validate(entity: CategoryEntity) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}

class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor({ name, description, isActive }: CategoryEntity) {
    Object.assign(this, { name, description, isActive });
  }
}
