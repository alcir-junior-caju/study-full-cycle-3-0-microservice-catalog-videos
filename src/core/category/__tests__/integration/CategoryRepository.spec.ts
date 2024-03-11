import { CategoryModel, CategoryRepository } from "../../infra";
import { CategoryEntity } from "../../domain";
import { setupSequelize, NotFoundError, UUIDValueObject } from "../../../shared";

describe('CategoryRepository Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategoryRepository;

  beforeEach(async () => {
    repository = new CategoryRepository(CategoryModel);
  });

  it('should be able to create a category', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    const model = await CategoryModel.findByPk(category.categoryId.value);
    expect(model.toJSON()).toMatchObject({
      categoryId: category.categoryId.value,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });

  it('should be able to find a category by id', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    const result = await repository.findById(category.categoryId);
    expect(result).toMatchObject(category);
  });

  it('should be throw when try to find a category by id and not found', async () => {
    const categoryNotFound = await repository.findById(new UUIDValueObject());
    expect(categoryNotFound).toBeNull();
  });

  it('should be able to list categories', async () => {
    const categories = CategoryEntity.fake().CreateCategories(3).build();
    await repository.bulkInsert(categories);
    const result = await repository.findAll();
    expect(result.length).toBe(3);
    expect(result).toMatchObject(categories);
  });

  it('should be able to update a category', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    category.name = "new name";
    category.description = "new description";
    category.isActive = false;
    await repository.update(category);
    const model = await CategoryModel.findByPk(category.categoryId.value);
    expect(model.toJSON()).toMatchObject({
      categoryId: category.categoryId.value,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });

  it('should be throw when try to update a category and not found', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.categoryId.value, CategoryEntity)
    );
  });

  it('should be able to delete a category', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    await repository.delete(category.categoryId);
    const model = await CategoryModel.findByPk(category.categoryId.value);
    expect(model).toBeNull();
  });

  it('should be throw when try to delete a category and not found', async () => {
    const categoryId = new UUIDValueObject();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.value, CategoryEntity)
    );
  });
});
