import { UUIDValueObject, ValidatorError } from "../../../../shared";
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
    entity.validate();
    if (entity.notification.hasErrors()) throw new ValidatorError(entity.notification.toJSON());
    return entity;
  }
}
