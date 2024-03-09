import { CategoryModel, CategoryModelMapper, CategoryRepository } from "../../infra";
import { setupSequelize, UUIDValueObject, ValidatorError } from "../../../shared";
import { CategoryEntity } from "../../domain";
import { CategorySearchParams, CategorySearchResult } from "../../repository";

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategoryRepository;

  beforeEach(async () => {
    repository = new CategoryRepository(CategoryModel);
  });

  it('should be throws error when category is invalid', async () => {
    const model = CategoryModel.build({
      categoryId: "9366e3f3-3b3e-4e3e-8e3e-3e3e3e3e3e3e",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it needs throws a EntityValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
      expect((error as ValidatorError).error).toMatchObject({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ],
      });
    }
  });

  it('should be able to convert a model to entity', async () => {
    const createdAt = new Date();
    const model = CategoryModel.build({
      categoryId: "9366e3f3-3b3e-4e3e-8e3e-3e3e3e3e3e3e",
      name: "category name",
      description: "category description",
      isActive: true,
      createdAt,
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new CategoryEntity({
        categoryId: new UUIDValueObject("9366e3f3-3b3e-4e3e-8e3e-3e3e3e3e3e3e"),
        name: "category name",
        description: "category description",
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  it('should be able to convert a entity to model', async () => {
    const createdAt = new Date();
    const entity = new CategoryEntity({
      categoryId: new UUIDValueObject("9366e3f3-3b3e-4e3e-8e3e-3e3e3e3e3e3e"),
      name: "category name",
      description: "category description",
      isActive: true,
      createdAt,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual(
      CategoryModel.build({
        categoryId: "9366e3f3-3b3e-4e3e-8e3e-3e3e3e3e3e3e",
        name: "category name",
        description: "category description",
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  describe('search method tests', () => {
    it('should be only paginate when other params are not provided', async () => {
      const createdAt = new Date();
      const categories = CategoryEntity.fake()
        .CreateCategories(16)
        .withName("category name")
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15,
      });
      searchOutput.toJSON().items.forEach(item => {
        expect(item).toBeInstanceOf(CategoryEntity);
        expect(item.categoryId).toBeDefined();
      });
      const items = searchOutput.toJSON().items.map(item => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "category name",
          description: "",
          isActive: true,
          createdAt,
        })
      );
    });

    it('should be order by createdAt desc when sort is not provided', async () => {
      const createdAt = new Date();
      const categories = CategoryEntity.fake()
        .CreateCategories(16)
        .withName(index => `category name ${index + 1}`)
        .withDescription(null)
        .withCreatedAt(index => new Date(createdAt.getTime() + index))
        .build();
      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.toJSON().items;
      [...items].reverse().forEach((item, index) => {
        expect(`category name ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it('should be set paginate and filter', async () => {
      const categories = [
        CategoryEntity.fake()
          .CreateCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CategoryEntity.fake()
          .CreateCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CategoryEntity.fake()
          .CreateCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CategoryEntity.fake()
          .CreateCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];
      await repository.bulkInsert(categories);
      const searchOutput = await repository.search(new CategorySearchParams({
        page: 1,
        perPage: 2,
        filter: "TEST",
      }));
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
        }).toJSON(true)
      );
    });

    it('should be set paginate, filter and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "createdAt"]);
      const categories = [
        CategoryEntity.fake().CreateCategory().withName("b").build(),
        CategoryEntity.fake().CreateCategory().withName("a").build(),
        CategoryEntity.fake().CreateCategory().withName("d").build(),
        CategoryEntity.fake().CreateCategory().withName("e").build(),
        CategoryEntity.fake().CreateCategory().withName("c").build(),
      ];
      await repository.bulkInsert(categories);
      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDirection: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDirection: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];
      for (const { params, result } of arrange) {
        const searchOutput = await repository.search(params);
        expect(searchOutput.toJSON(true)).toMatchObject(result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        CategoryEntity.fake().CreateCategory().withName('test').build(),
        CategoryEntity.fake().CreateCategory().withName('a').build(),
        CategoryEntity.fake().CreateCategory().withName('TEST').build(),
        CategoryEntity.fake().CreateCategory().withName('e').build(),
        CategoryEntity.fake().CreateCategory().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      it.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
