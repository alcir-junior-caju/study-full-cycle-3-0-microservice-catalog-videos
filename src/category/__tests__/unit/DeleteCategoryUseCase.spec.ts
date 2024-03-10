import { InvalidUUIDError, NotFoundError, UUIDValueObject } from "../../../shared";
import { DeleteCategoryUseCase } from "../../application";
import { CategoryEntity } from "../../domain";
import { CategoryInMemoryRepository } from "../../infra";

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should be throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUUIDError(),
    );

    const categoryId = new UUIDValueObject();

    await expect(() => useCase.execute({ id: categoryId.value })).rejects.toThrow(
      new NotFoundError(categoryId.value, CategoryEntity),
    );
  });

  it('should be delete a category', async () => {
    const items = [new CategoryEntity({ name: 'test 1' })];
    repository.items = items;
    await useCase.execute({
      id: items[0].categoryId.value,
    });
    expect(repository.items).toHaveLength(0);
  });
});
