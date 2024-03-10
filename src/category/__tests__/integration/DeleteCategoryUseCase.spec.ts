import { NotFoundError, UUIDValueObject, setupSequelize } from "../../../shared";
import { DeleteCategoryUseCase } from "../../application";
import { CategoryEntity } from "../../domain";
import { CategoryModel, CategoryRepository } from "../../infra";

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should be throws error when entity not found', async () => {
    const categoryId = new UUIDValueObject();
    await expect(() => useCase.execute({ id: categoryId.value })).rejects.toThrow(
      new NotFoundError(categoryId.value, CategoryEntity),
    );
  });

  it('should be delete a category', async () => {
    const category = CategoryEntity.fake().CreateCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.categoryId.value,
    });
    await expect(repository.findById(category.categoryId)).resolves.toBeNull();
  });
});
