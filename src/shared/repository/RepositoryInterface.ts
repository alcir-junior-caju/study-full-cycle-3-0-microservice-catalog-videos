import { Entity as AbstractEntity, ValueObject } from "../domain";

export interface RepositoryInterface<
  Entity extends AbstractEntity,
  RntityId extends ValueObject
> {
  insert(entity: Entity): Promise<void>;
  bulkInsert(entities: Entity[]): Promise<void>;
  update(entity: Entity): Promise<void>;
  delete(entityId: RntityId): Promise<void>;

  findById(entityId: RntityId): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;

  getEntity(): new (...args: any[]) => Entity;
}
