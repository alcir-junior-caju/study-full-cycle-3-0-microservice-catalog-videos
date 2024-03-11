import { DataType } from "sequelize-typescript";
import { CategoryModel } from "../../infra";
import { CategoryEntity } from "../../domain";
import { setupSequelize } from "../../../shared";

describe('CategoryModel Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should be mapping params', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    expect(attributes).toStrictEqual([
      'categoryId',
      'name',
      'description',
      'isActive',
      'createdAt',
    ]);

    const categoryIdAttr = attributesMap.categoryId;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'categoryId',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.isActive;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'isActive',
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.createdAt;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'createdAt',
      type: DataType.DATE(3),
    });
  });

  it('should be create a category', async () => {
    const categoryEntity = CategoryEntity.fake().CreateCategory().build();

    CategoryModel.create({
      categoryId: categoryEntity.categoryId.value,
      name: categoryEntity.name,
      description: categoryEntity.description,
      isActive: categoryEntity.isActive,
      createdAt: categoryEntity.createdAt,
    })

    const categoryModel = CategoryModel.findByPk(categoryEntity.categoryId.value);

    expect((await categoryModel).toJSON()).toStrictEqual({
      categoryId: categoryEntity.categoryId.value,
      name: categoryEntity.name,
      description: categoryEntity.description,
      isActive: categoryEntity.isActive,
      createdAt: categoryEntity.createdAt,
    });
  });
});
