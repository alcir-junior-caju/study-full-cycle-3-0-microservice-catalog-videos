import { UUIDValueObject } from "../../../shared";
import { CategoryEntity } from "../../domain";

describe('CategoryEntity Unit Tests', () => {
  beforeEach(() => {
    CategoryEntity.prototype.validate = jest
      .fn()
      .mockImplementation(CategoryEntity.prototype.validate);
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

  // TODO: remove after challenge
  it('should be update category', () => {
    const category = CategoryEntity.create({
      name: 'Movie',
      description: 'Movies',
    });
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movies');
    category.update({
      name: 'Movie 2',
      description: 'Movies 2',
    });
    expect(category.name).toBe('Movie 2');
    expect(category.description).toBe('Movies 2');
  });
});

describe('Category Validator', () => {
  describe('create command', () => {
    it('should be an invalid category with name property', () => {
      const category = CategoryEntity.create({ name: 't'.repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should be a invalid category using name property', () => {
      const category = CategoryEntity.create({ name: 'Movie' });
      category.changeName('t'.repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
