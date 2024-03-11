import { UUIDValueObject, setupSequelize } from '../../../shared';
import { CreateCategoryUseCase } from '../../application';
import { CategoryModel, CategoryRepository } from '../../infra';

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should be create a category', async () => {
    let output = await useCase.execute({ name: 'Category 1' });
    let entity = await repository.findById(new UUIDValueObject(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: 'Category 1',
      description: 'Category 1 description',
    });
    entity = await repository.findById(new UUIDValueObject(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: false,
    });
    entity = await repository.findById(new UUIDValueObject(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });
  });
});
