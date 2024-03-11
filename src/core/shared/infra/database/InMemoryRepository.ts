import {
  Entity as AbstractEntity,
  NotFoundError,
  RepositoryInterface,
  RepositorySearchableInterface,
  SearchParams,
  SearchResult,
  SortDirection,
  ValueObject,
} from '../../domain';

export abstract class InMemoryRepository<
  Entity extends AbstractEntity,
  EntityId extends ValueObject,
> implements RepositoryInterface<Entity, EntityId>
{
  items: Entity[] = [];

  async insert(entity: Entity): Promise<void> {
    this.items.push(entity);
  }
  async bulkInsert(entities: Entity[]): Promise<void> {
    this.items.push(...entities);
  }
  async update(entity: Entity): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entity.entityId),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity());
    }
    this.items[indexFound] = entity;
  }
  async delete(entityId: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entityId),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entityId, this.getEntity());
    }
    this.items.splice(indexFound, 1);
  }
  async findById(entityId: EntityId): Promise<Entity | null> {
    const item = this.items.find((item) => item.entityId.equals(entityId));
    return typeof item === 'undefined' ? null : item;
  }
  async findAll(): Promise<Entity[]> {
    return this.items;
  }
  abstract getEntity(): new (...args: any[]) => Entity;
}

export abstract class InMemorySearchableRepository<
    Entity extends AbstractEntity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<Entity, EntityId>
  implements RepositorySearchableInterface<Entity, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search({
    filter,
    sort,
    sortDirection,
    page,
    perPage,
  }: SearchParams<Filter>): Promise<SearchResult<Entity>> {
    const itemsFiltered = await this.setFilter(this.items, filter);
    const itemsSorted = this.setSort(itemsFiltered, sort, sortDirection);
    const itemsPaginated = this.setPaginate(itemsSorted, page, perPage);
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: page,
      perPage,
    });
  }

  protected abstract setFilter(
    items: Entity[],
    filter: Filter | null,
  ): Promise<Entity[]>;

  protected setPaginate(
    items: Entity[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ) {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }

  protected setSort(
    items: Entity[],
    sort: string | null,
    sortDirection: SortDirection | null,
    customGetter?: (sort: string, item: Entity) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a: any, b: any) => {
      const aValue = customGetter ? customGetter(sort, a) : a[sort];
      const bValue = customGetter ? customGetter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
