import { UseCaseInterface } from "../../../shared";
import { CategoryEntity, CategoryRepositoryInterface } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "./common";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type CreateCategoryOutput = CategoryOutput;

export class CreateCategoryUseCase implements UseCaseInterface<
  CreateCategoryInput,
  CreateCategoryOutput
> {
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = CategoryEntity.create(input);
    await this.categoryRepository.insert(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}
