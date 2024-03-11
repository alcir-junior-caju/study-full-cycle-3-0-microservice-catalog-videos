import {
  NotFoundError,
  UUIDValueObject,
  setupSequelize,
} from '../../../shared';
import { UpdateCategoryUseCase } from '../../application';
import { CategoryEntity } from '../../domain';
import { CategoryModel, CategoryRepository } from '../../infra';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should br throws errors when category not found', async () => {
    const categoryId = new UUIDValueObject();
    await expect(() =>
      useCase.execute({ id: categoryId.value }),
    ).rejects.toThrow(new NotFoundError(categoryId.value, CategoryEntity));
  });

  it('should be update a category', async () => {
    const entity = CategoryEntity.fake().CreateCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.categoryId.value,
      name: 'test',
    });
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: 'test',
      description: entity.description,
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
          description: null,
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
        ...(i.input.name && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('isActive' in i.input && { isActive: i.input.isActive }),
      });
      const entityUpdated = await repository.findById(
        new UUIDValueObject(i.input.id),
      );
      expect(output).toStrictEqual({
        id: entity.categoryId.value,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated!.createdAt,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        categoryId: new UUIDValueObject(entity.categoryId.value),
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated!.createdAt,
      });
    }
  });
});
