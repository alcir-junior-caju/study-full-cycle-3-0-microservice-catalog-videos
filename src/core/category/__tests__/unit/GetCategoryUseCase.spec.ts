import {
  InvalidUUIDError,
  NotFoundError,
  UUIDValueObject,
} from '../../../shared';
import { GetCategoryUseCase } from '../../application';
import { CategoryEntity } from '../../domain';
import { CategoryInMemoryRepository } from '../../infra';

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it('should be throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUUIDError(),
    );

    const categoryId = new UUIDValueObject();
    await expect(() =>
      useCase.execute({ id: categoryId.value }),
    ).rejects.toThrow(new NotFoundError(categoryId.value, CategoryEntity));
  });

  it('should be returns a category', async () => {
    const items = [CategoryEntity.create({ name: 'Movie' })];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].categoryId.value });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].categoryId.value,
      name: 'Movie',
      description: '',
      isActive: true,
      createdAt: items[0].createdAt,
    });
  });
});
