import { CategoryOutputMapper, ListCategoriesUseCase } from "../../application";
import { CategoryEntity, CategorySearchResult } from "../../domain";
import { CategoryInMemoryRepository } from "../../infra";

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });

    const entity = CategoryEntity.create({ name: 'Movie' });
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });
  });

  it('should be return output sorted by createdAt when input param is empty', async () => {
    const items = [
      new CategoryEntity({ name: 'test 1' }),
      new CategoryEntity({
        name: 'test 2',
        createdAt: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      new CategoryEntity({ name: 'a' }),
      new CategoryEntity({
        name: 'AAA',
      }),
      new CategoryEntity({
        name: 'AaA',
      }),
      new CategoryEntity({
        name: 'b',
      }),
      new CategoryEntity({
        name: 'c',
      }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await useCase.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });

    output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDirection: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });
  });
});
