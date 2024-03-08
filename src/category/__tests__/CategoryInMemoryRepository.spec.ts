import { CategoryEntity } from "../domain";
import { CategoryInMemoryRepository } from "../infra";

describe('CategoryInMemoryRepository Tests', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it('should no filter items when filter object is null', async () => {
    const items = [CategoryEntity.create({ name: 'Category 1' })];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['setFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      CategoryEntity.create({ name: 'test' }),
      CategoryEntity.create({ name: 'TEST' }),
      CategoryEntity.create({ name: 'fake' }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['setFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', () => {
    const createdAt = new Date();

    const items = [
      new CategoryEntity({ name: 'test', createdAt }),
      new CategoryEntity({ name: 'TEST', createdAt: new Date(createdAt.getTime() + 100) }),
      new CategoryEntity({ name: 'fake', createdAt: new Date(createdAt.getTime() + 200) }),
    ];

    const itemsSorted = repository['setSort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', () => {
    const items = [
      CategoryEntity.create({ name: 'c' }),
      CategoryEntity.create({ name: 'b' }),
      CategoryEntity.create({ name: 'a' }),
    ];

    let itemsSorted = repository['setSort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository['setSort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
