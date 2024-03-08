import { InMemorySearchableRepository, SortDirection, UUIDValueObject } from "../../../shared";
import { CategoryEntity } from "../../domain";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  CategoryEntity,
  UUIDValueObject
> {
  sortableFields: string[] = ["name", "createdAt"];

  protected async setFilter(items: CategoryEntity[], filter: string): Promise<CategoryEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()) || item.description.toLowerCase().includes(filter.toLowerCase()));
  }

  getEntity(): new (...args: any[]) => CategoryEntity {
    return CategoryEntity;
  }

  protected setSort(
    items: CategoryEntity[],
    sort: string | null,
    sortDirection: SortDirection | null
  ) {
    return sort
      ? super.setSort(items, sort, sortDirection)
      : super.setSort(items, "createdAt", "desc");
  }
}
