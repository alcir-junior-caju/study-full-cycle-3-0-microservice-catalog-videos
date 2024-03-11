import { SearchParams, SearchResult, ValueObject } from '../valueObject';
import { Entity as AbstractEntity } from '../entity';

export interface RepositoryInterface<
  Entity extends AbstractEntity,
  EntityId extends ValueObject,
> {
  insert(entity: Entity): Promise<void>;
  bulkInsert(entities: Entity[]): Promise<void>;
  update(entity: Entity): Promise<void>;
  delete(entityId: EntityId): Promise<void>;

  findById(entityId: EntityId): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;

  getEntity(): new (...args: any[]) => Entity;
}

export interface RepositorySearchableInterface<
  Entity extends AbstractEntity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends RepositoryInterface<Entity, EntityId> {
  sortableFields: string[];
  search(params: SearchInput): Promise<SearchOutput>;
}
