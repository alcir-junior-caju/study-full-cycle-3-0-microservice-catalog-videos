import { NotFoundError, UUIDValueObject, UseCaseInterface } from "../../../../shared";
import { CategoryEntity, CategoryRepositoryInterface } from "../../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../common";

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase implements UseCaseInterface<
  GetCategoryInput,
  GetCategoryOutput
> {
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new UUIDValueObject(input.id);
    const category = await this.categoryRepository.findById(uuid);
    if (!category) throw new NotFoundError(uuid.value, CategoryEntity);
    return CategoryOutputMapper.toOutput(category);
  }
}
