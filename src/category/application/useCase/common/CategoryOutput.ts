import { CategoryEntity } from "../../../domain";

export type CategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: CategoryEntity): CategoryOutput {
    const { categoryId, ...rest } = entity.toJSON();
    return {
      id: categoryId.value,
      ...rest,
    };
  }
}
