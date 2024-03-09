import { UUIDValueObject } from "../../../../shared";
import { CategoryEntity } from "../../../domain";
import { CategoryModel } from "./CategoryModel";

export class CategoryModelMapper {
  static toModel(entity: CategoryEntity): CategoryModel {
    return CategoryModel.build({
      categoryId: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt
    });
  }

  static toEntity(model: CategoryModel): CategoryEntity {
    const entity = new CategoryEntity({
      categoryId: new UUIDValueObject(model.categoryId),
      name: model.name,
      description: model.description,
      isActive: model.isActive,
      createdAt: model.createdAt
    });
    CategoryEntity.validate(entity);
    return entity;
  }
}
