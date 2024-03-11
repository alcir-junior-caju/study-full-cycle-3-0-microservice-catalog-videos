import { Entity, UUIDValueObject } from "../domain";
import { NotFoundError } from "../domain";
import { InMemoryRepository } from "../infra";

type StubEntityParams = {
  entityId?: UUIDValueObject;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: UUIDValueObject;
  name: string;
  price: number;

  constructor({
    entityId = new UUIDValueObject(),
    name,
    price
  }: StubEntityParams) {
    super();
    this.entityId = entityId ?? new UUIDValueObject();
    this.name = name;
    this.price = price;
  };

  toJSON() {
    return {
      entityId: this.entityId.value,
      name: this.name,
      price: this.price
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, UUIDValueObject> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should create a new entity', async () => {
    const entity = new StubEntity({
      entityId: new UUIDValueObject(),
      name: 'Test Entity',
      price: 100
    });
    await repository.insert(entity);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].entityId).toBe(entity.entityId);
    expect(repository.items[0].name).toBe(entity.name);
    expect(repository.items[0].price).toBe(entity.price);
  });

  it('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entityId: new UUIDValueObject(),
        name: 'Test Entity 1',
        price: 100
      }),
      new StubEntity({
        entityId: new UUIDValueObject(),
        name: 'Test Entity 2',
        price: 200
      })
    ];
    await repository.bulkInsert(entities);
    expect(repository.items.length).toBe(2);
    expect(repository.items[0].entityId).toBe(entities[0].entityId);
    expect(repository.items[0].name).toBe(entities[0].name);
    expect(repository.items[0].price).toBe(entities[0].price);
    expect(repository.items[1].entityId).toBe(entities[1].entityId);
    expect(repository.items[1].name).toBe(entities[1].name);
    expect(repository.items[1].price).toBe(entities[1].price);
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({
      entityId: new UUIDValueObject(),
      name: 'Test Entity',
      price: 100
    });
    await repository.insert(entity);
    const updatedEntity = new StubEntity({
      entityId: entity.entityId,
      name: 'Updated Entity',
      price: 200
    });
    await repository.update(updatedEntity);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].entityId).toBe(updatedEntity.entityId);
    expect(repository.items[0].name).toBe(updatedEntity.name);
    expect(repository.items[0].price).toBe(updatedEntity.price);
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({
      entityId: new UUIDValueObject(),
      name: 'Test Entity',
      price: 100
    });
    await repository.insert(entity);
    await repository.delete(entity.entityId);
    expect(repository.items.length).toBe(0);
  });

  it('should find an entity by id', async () => {
    const entity = new StubEntity({
      entityId: new UUIDValueObject(),
      name: 'Test Entity',
      price: 100
    });
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.entityId);
    expect(foundEntity).not.toBeNull();
    expect(foundEntity?.entityId).toBe(entity.entityId);
    expect(foundEntity?.name).toBe(entity.name);
    expect(foundEntity?.price).toBe(entity.price);
  });

  it('should find all entities', async () => {
    const entities = [
      new StubEntity({
        entityId: new UUIDValueObject(),
        name: 'Test Entity 1',
        price: 100
      }),
      new StubEntity({
        entityId: new UUIDValueObject(),
        name: 'Test Entity 2',
        price: 200
      })
    ];
    await repository.bulkInsert(entities);
    const foundEntities = await repository.findAll();
    expect(foundEntities.length).toBe(2);
    expect(foundEntities[0].entityId).toBe(entities[0].entityId);
    expect(foundEntities[0].name).toBe(entities[0].name);
    expect(foundEntities[0].price).toBe(entities[0].price);
    expect(foundEntities[1].entityId).toBe(entities[1].entityId);
    expect(foundEntities[1].name).toBe(entities[1].name);
    expect(foundEntities[1].price).toBe(entities[1].price);
  });

  it('should get the entity class', () => {
    const entityClass = repository.getEntity();
    expect(entityClass).toBe(StubEntity);
  });

  it('should throw an error when update not found', async () => {
    const entity = new StubEntity({
      entityId: new UUIDValueObject(),
      name: 'Test Entity',
      price: 100
    });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });

  it('should throw an error when delete not found', async () => {
    const entityId = new UUIDValueObject();
    await expect(repository.delete(entityId)).rejects.toThrow(
      new NotFoundError(entityId, StubEntity),
    );
  });

  it('should return null when find by id not found', async () => {
    const entityId = new UUIDValueObject();
    const foundEntity = await repository.findById(entityId);
    expect(foundEntity).toBeNull();
  });
});
