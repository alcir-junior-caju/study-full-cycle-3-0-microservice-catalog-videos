import { NotFoundError, UUIDValueObject, UseCaseInterface } from "../../../shared";
import { CategoryEntity, CategoryRepositoryInterface } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "./common";

export type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase implements UseCaseInterface<
  UpdateCategoryInput,
  UpdateCategoryOutput
> {
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new UUIDValueObject(input.id);
    const category = await this.categoryRepository.findById(uuid);
    if (!category) throw new NotFoundError(input.id, CategoryEntity);
    input?.name && category.changeName(input.name);
    input?.description && category.changeDescription(input.description);
    input?.isActive === true && category.activate();
    input?.isActive === false && category.deactivate();
    await this.categoryRepository.update(category);
    return CategoryOutputMapper.toOutput(category);
  }
}
