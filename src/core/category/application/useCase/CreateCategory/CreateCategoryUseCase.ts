import { UseCaseInterface, ValidatorError } from '../../../../shared';
import { CategoryEntity, CategoryRepositoryInterface } from '../../../domain';
import { CategoryOutput, CategoryOutputMapper } from '../common';
import { CreateCategoryInput } from './CreateCategoryInput';

export type CreateCategoryOutput = CategoryOutput;

export class CreateCategoryUseCase
  implements UseCaseInterface<CreateCategoryInput, CreateCategoryOutput>
{
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = CategoryEntity.create(input);
    if (entity.notification.hasErrors()) {
      throw new ValidatorError(entity.notification.toJSON());
    }
    await this.categoryRepository.insert(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}
