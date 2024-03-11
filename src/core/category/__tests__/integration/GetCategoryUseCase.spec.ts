import { NotFoundError, UUIDValueObject, setupSequelize } from "../../../shared";
import { GetCategoryUseCase } from "../../application";
import { CategoryEntity } from "../../domain";
import { CategoryModel, CategoryRepository } from "../../infra";

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it('should be throws error when entity not found', async () => {
    const categoryId = new UUIDValueObject();
    await expect(() => useCase.execute({ id: categoryId.value })).rejects.toThrow(
      new NotFoundError(categoryId.value, CategoryEntity),
    );
  });

  it('should be returns a category', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.categoryId.value });
    expect(output).toStrictEqual({
      id: category.categoryId.value,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });
});
