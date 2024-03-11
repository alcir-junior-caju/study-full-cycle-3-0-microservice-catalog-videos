import { Entity, UUIDValueObject } from '../../../shared';
import { CategoryFakeBuilder } from '../faker';
import { CategoryValidatorFactory } from '../validator';

type CategoryEntityParams = {
  categoryId?: UUIDValueObject;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
};

type CategoryEntityCreateCommand = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export class CategoryEntity extends Entity {
  categoryId: UUIDValueObject;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;

  constructor({
    categoryId,
    name,
    description,
    isActive,
    createdAt,
  }: CategoryEntityParams) {
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

  static create({
    name,
    description,
    isActive,
  }: CategoryEntityCreateCommand): CategoryEntity {
    const category = new CategoryEntity({
      name,
      description,
      isActive: isActive,
    });
    category.validate(['name']);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  // TODO: remove after challenge
  update({ name, description }: CategoryEntityCreateCommand): void {
    this.name = name;
    this.description = description;
    this.validate(['name']);
  }

  changeDescription(description: string): void {
    this.description = description;
    this.validate(['name']);
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
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
      createdAt: this.createdAt,
    };
  }
}
