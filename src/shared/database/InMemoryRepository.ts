import { Entity as AbstractEntity, ValueObject } from "../domain";
import { RepositoryInterface } from "../repository";

export abstract class InMemoryRepository<
  Entity extends AbstractEntity,
  EntityId extends ValueObject
> implements RepositoryInterface<Entity, EntityId> {
  items: Entity[] = [];

  async insert(entity: Entity): Promise<void> {
    this.items.push(entity);
  }
  async bulkInsert(entities: Entity[]): Promise<void> {
    this.items.push(...entities);
  }
  async update(entity: Entity): Promise<void> {
    const indexFound =  this.items.findIndex((item) => item.entityId.equals(entity.entityId));
    if(indexFound === -1) {
      throw new Error("Entity not found");
    }
    this.items[indexFound] = entity;
  }
  async delete(entityId: EntityId): Promise<void> {
    const indexFound =  this.items.findIndex((item) => item.entityId.equals(entityId));
    if(indexFound === -1) {
      throw new Error("Entity not found");
    }
    this.items.splice(indexFound, 1);
  }
  async findById(entityId: EntityId): Promise<Entity | null> {
    const item = this.items.find((item) => item.entityId.equals(entityId));
    return typeof item === "undefined" ? null : item;
  }
  async findAll(): Promise<Entity[]> {
    return this.items;
  }
  abstract getEntity(): new (...args: any[]) => Entity;
}
