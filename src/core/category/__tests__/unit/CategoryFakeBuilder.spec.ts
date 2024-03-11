import { Chance } from 'chance';
import { UUIDValueObject } from '../../../shared';
import { CategoryFakeBuilder } from '../../domain/faker';

describe('CategoryFakeBuilder Unit Tests', () => {
  describe('categoryId param', () => {
    const faker = CategoryFakeBuilder.CreateCategory();

    it('should throw error when any with methods has called', () => {
      expect(() => faker.categoryId).toThrow(
        new Error("Property categoryId not have a factory, use 'with' methods"),
      );
    });

    it('should be undefined', () => {
      expect(faker['_categoryId']).toBeUndefined();
    });

    it('should be withUUID', () => {
      const categoryId = new UUIDValueObject();
      const $this = faker.withUUID(categoryId);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect($this['_categoryId']).toBe(categoryId);

      faker.withUUID(() => categoryId);
      // @ts-expect-error _categoryId is a callable
      expect(faker['_categoryId']()).toBe(categoryId);
      expect(faker.categoryId).toBe(categoryId);
    });

    it('should be pass index to categoryId factory', () => {
      let mockFactory = jest.fn(() => new UUIDValueObject());
      faker.withUUID(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const categoryId = new UUIDValueObject();
      mockFactory = jest.fn(() => categoryId);
      const fakerMany = CategoryFakeBuilder.CreateCategories(2);
      fakerMany.withUUID(mockFactory);
      fakerMany.build();
      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].categoryId).toBe(categoryId);
      expect(fakerMany.build()[1].categoryId).toBe(categoryId);
    });
  });

  describe('name param', () => {
    const faker = CategoryFakeBuilder.CreateCategory();

    it('should be a function', () => {
      expect(faker['_name']).toBeInstanceOf(Function);
    });

    it('should be call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    it('should be withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      // @ts-expect-error _name is a callable
      expect(faker['_name']()).toBe('test name');
      expect(faker.name).toBe('test name');
    });

    it('should be pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = CategoryFakeBuilder.CreateCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    it('should be invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('description param', () => {
    const faker = CategoryFakeBuilder.CreateCategory();

    it('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    it('should call the sentence method', () => {
      const chance = Chance();
      const spySentenceMethod = jest.spyOn(chance, 'sentence');
      faker['chance'] = chance;
      faker.build();
      expect(spySentenceMethod).toHaveBeenCalled();
    });

    it('withDescription', () => {
      const $this = faker.withDescription('test description');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_description']).toBe('test description');

      faker.withDescription(() => 'test description');
      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe('test description');

      expect(faker.description).toBe('test description');
    });

    it('should pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`test description 0`);

      const fakerMany = CategoryFakeBuilder.CreateCategories(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });
  });

  describe('isActive param', () => {
    const faker = CategoryFakeBuilder.CreateCategory();
    it('should be a function', () => {
      expect(typeof faker['_isActive']).toBe('function');
    });

    it('should be activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_isActive']).toBe(true);
      expect(faker.isActive).toBe(true);
    });

    it('should be deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_isActive']).toBe(false);
      expect(faker.isActive).toBe(false);
    });
  });

  describe('createdAt param', () => {
    const faker = CategoryFakeBuilder.CreateCategory();

    it('should throw error when any with methods has called', () => {
      const fakerCategory = CategoryFakeBuilder.CreateCategory();
      expect(() => fakerCategory.createdAt).toThrow(
        new Error("Property createdAt not have a factory, use 'with' methods"),
      );
    });

    it('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    it('should be a withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    it('should pass index to createdAt factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.CreateCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should be create a category', () => {
    const faker = CategoryFakeBuilder.CreateCategory();
    let category = faker.build();

    expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.description === 'string').toBeTruthy();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    const categoryId = new UUIDValueObject();
    category = faker
      .withUUID(categoryId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    expect(category.categoryId.value).toBe(categoryId.value);
    expect(category.name).toBe('name test');
    expect(category.description).toBe('description test');
    expect(category.isActive).toBe(false);
    expect(category.createdAt).toBe(createdAt);
  });

  test('should create many categories', () => {
    const faker = CategoryFakeBuilder.CreateCategories(2);
    let categories = faker.build();

    categories.forEach((category) => {
      expect(category.categoryId).toBeInstanceOf(UUIDValueObject);
      expect(typeof category.name === 'string').toBeTruthy();
      expect(typeof category.description === 'string').toBeTruthy();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    const createdAt = new Date();
    const categoryId = new UUIDValueObject();
    categories = faker
      .withUUID(categoryId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    categories.forEach((category) => {
      expect(category.categoryId.value).toBe(categoryId.value);
      expect(category.name).toBe('name test');
      expect(category.description).toBe('description test');
      expect(category.isActive).toBe(false);
      expect(category.createdAt).toBe(createdAt);
    });
  });
});
