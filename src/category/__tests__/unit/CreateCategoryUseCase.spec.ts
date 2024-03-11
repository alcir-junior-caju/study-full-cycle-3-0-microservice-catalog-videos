import { CreateCategoryUseCase } from "../../application";
import { CategoryInMemoryRepository } from "../../infra";

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should be throw a validation error', async () => {
    const input = { name: 't'.repeat(256) };
    await expect(() => useCase.execute(input)).rejects.toThrow(
      'Entity Validation Error'
    );
  });

  it('should be create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'Category 1' });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].categoryId.value,
      name: 'Category 1',
      description: '',
      isActive: true,
      createdAt: repository.items[0].createdAt,
    });

    output = await useCase.execute({
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: false,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].categoryId.value,
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: false,
      createdAt: repository.items[1].createdAt,
    });
  });
});
