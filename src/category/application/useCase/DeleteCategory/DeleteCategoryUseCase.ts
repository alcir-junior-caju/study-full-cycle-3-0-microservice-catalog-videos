import { UUIDValueObject, UseCaseInterface } from "../../../../shared";
import { CategoryRepositoryInterface } from "../../../domain";

export type DeleteCategoryInput = {
  id: string;
};

export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase implements UseCaseInterface<
  DeleteCategoryInput,
  DeleteCategoryOutput
> {
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const uuid = new UUIDValueObject(input.id);
    await this.categoryRepository.delete(uuid);
  }
}
