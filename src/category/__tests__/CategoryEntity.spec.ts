import { UUIDValueObject } from "../../shared";
import { CategoryEntity } from "../domain";

describe('CategoryEntity Tests', () => {
  let validateSpy: jest.SpyInstance;
  beforeEach(() => {
    validateSpy = jest.spyOn(CategoryEntity, 'validate');
  });

  it('should be create a category only name', () => {
    const category = new CategoryEntity({
      name: 'Movie',
    });
    expect(category).toBeInstanceOf(CategoryEntity);
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.name).toBe('Movie');
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it('should be create a category with all data', () => {
    const categoryDate = new Date();
    const category = new CategoryEntity({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
      createdAt: categoryDate,
    });
    expect(category).toBeInstanceOf(CategoryEntity);
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movies');
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBe(categoryDate);
  });

  it('should be create a category with all data using static method', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
    });
    expect(category).toBeInstanceOf(CategoryEntity);
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movies');
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should be change name', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
    });
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.name).toBe('Movie');
    category.changeName('Movie 2');
    expect(category.name).toBe('Movie 2');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it('should be change description', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
    });
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.description).toBe('Movies');
    category.changeDescription('Movies 2');
    expect(category.description).toBe('Movies 2');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it('should be activate category', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
      isActive: false,
    });
    expect(category.isActive).toBeFalsy();
    category.activate();
    expect(category.isActive).toBeTruthy();
  });

  it('should be deactivate category', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
    });
    expect(category.isActive).toBeTruthy();
    category.deactivate();
    expect(category.isActive).toBeFalsy();
  });

  it('should be return json', () => {
    const categoryDate = new Date();
    const category = new CategoryEntity({
      name: 'Movie',
      description: 'Movies',
      isActive: true,
      createdAt: categoryDate,
    });
    expect(category.toJSON()).toEqual({
      categoryId: category.categoryId,
      name: 'Movie',
      description: 'Movies',
      isActive: true,
      createdAt: categoryDate,
    });
  });

  it.each([
    { categoryId: null, name: 'Movie 1' },
    { categoryId: undefined, name: 'Movie 2' },
    { categoryId: new UUIDValueObject(), name: 'Movie 3' },
  ])(`should be create a category with %p`, ({ categoryId, name }) => {
    const category = new CategoryEntity({
      categoryId: categoryId as UUIDValueObject,
      name,
    });
    expect(category).toBeInstanceOf(CategoryEntity);
    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(category.name).toBe(name);
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  const changeName = [
    {
      input: { name: null },
      expected: {
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      }
    },
    {
      input: { name: undefined },
      expected: {
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      }
    },
    {
      input: { name: '' },
      expected: {
        name: [
          "name should not be empty"
        ]
      }
    },
    {
      input: { name: 123 as any },
      expected: {
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      }
    },
    {
      input: { name: 'a'.repeat(256) },
      expected: {
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      }
    },
  ];

  it.each(changeName)(`should throw errors for invalid name: %j`, ({
    input,
    expected
  }) => {
    expect(() => CategoryEntity.create(input)).containsErrorMessages(expected);
  });

  it('should throw error for invalid description', () => {
    expect(() => CategoryEntity.create({
      name: 'Movie',
      description: 123 as any,
    })).containsErrorMessages({
      description: [
        "description must be a string"
      ]
    });
  });
});
