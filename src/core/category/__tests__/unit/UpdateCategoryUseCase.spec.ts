import {
  InvalidUUIDError,
  NotFoundError,
  UUIDValueObject,
} from '../../../shared';
import { UpdateCategoryUseCase } from '../../application';
import { CategoryEntity } from '../../domain';
import { CategoryInMemoryRepository } from '../../infra';

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should be throws errors when category not found', async () => {
    await expect(() => useCase.execute({ id: 'invalid-id' })).rejects.toThrow(
      new InvalidUUIDError(),
    );
    const uuid = new UUIDValueObject();
    await expect(() => useCase.execute({ id: uuid.value })).rejects.toThrow(
      new NotFoundError(uuid.value, CategoryEntity),
    );
  });

  it('should be update category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = CategoryEntity.create({ name: 'Category 1' });
    repository.items = [entity];
    let output = await useCase.execute({
      id: entity.categoryId.value,
      name: 'Category 2',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: 'Category 2',
      description: '',
      isActive: true,
      createdAt: entity.createdAt,
    });
    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        isActive?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        isActive: boolean;
        createdAt: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          isActive: true,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
        },
        expected: {
          id: entity.categoryId.value,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('isActive' in i.input && { isActive: i.input.isActive }),
      });
      expect(output).toStrictEqual({
        id: entity.categoryId.value,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: i.expected.createdAt,
      });
    }
  });
});
