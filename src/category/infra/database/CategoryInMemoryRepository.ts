import { InMemoryRepository, UUIDValueObject } from "../../../shared";
import { CategoryEntity } from "../../domain";

export class CategoryInMemoryRepository extends InMemoryRepository<
  CategoryEntity,
  UUIDValueObject
> {
  getEntity(): new (...args: any[]) => CategoryEntity {
    return CategoryEntity;
  }
}
