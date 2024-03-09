import { RepositorySearchableInterface, SearchParams, SearchResult, UUIDValueObject } from "../../shared";
import { CategoryEntity } from "../domain";

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<CategoryEntity> {}

export interface CategoryRepositoryInterface extends RepositorySearchableInterface<
  CategoryEntity,
  UUIDValueObject,
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult
> {}
