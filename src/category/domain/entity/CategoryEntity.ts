import { Entity, UUIDValueObject, ValidatorError } from "../../../shared";
import { CategoryFakeBuilder } from "../../faker";
import { CategoryValidatorFactory } from "../../validator";

type CategoryEntityParams = {
  categoryId?: UUIDValueObject;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
}

type CategoryEntityCreateCommand = {
  name: string;
  description?: string;
  isActive?: boolean;
}

export class CategoryEntity extends Entity {
  categoryId: UUIDValueObject;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;

  constructor({ categoryId, name, description, isActive, createdAt }: CategoryEntityParams) {
    super();
    this.categoryId = categoryId ?? new UUIDValueObject();
    this.name = name;
    this.description = description ?? '';
    this.isActive = isActive ?? true;
    this.createdAt = createdAt ?? new Date();
  }

  get entityId(): UUIDValueObject {
    return this.categoryId;
  }

  static validate(entity: CategoryEntity) {
    const validator = CategoryValidatorFactory.create();
    const isValid =  validator.validate(entity);
    if (!isValid) {
      throw new ValidatorError(validator.errors);
    }
  }

  static create({ name, description, isActive }: CategoryEntityCreateCommand): CategoryEntity {
    const category = new CategoryEntity({
      name,
      description,
      isActive: isActive
    });
    CategoryEntity.validate(category);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    CategoryEntity.validate(this);
  }

  // TODO: remove after challenge
  update({ name, description }: CategoryEntityCreateCommand): void {
    this.name = name;
    this.description = description;
    CategoryEntity.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    CategoryEntity.validate(this);
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON(): CategoryEntityParams {
    return {
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt
    };
  }
}
