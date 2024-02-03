import { RepositoryInterface, UUIDValueObject } from "../../shared";
import { CategoryEntity } from "../domain";

export interface CategoryRepositoryInterface extends RepositoryInterface<CategoryEntity, UUIDValueObject> {}
