import { PaginationOutput, PaginationOutputMapper, SortDirection, UseCaseInterface } from "../../../../shared";
import { CategoryFilter, CategoryRepositoryInterface, CategorySearchParams, CategorySearchResult } from "../../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../common";

export type ListCategoriesInput = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: CategoryFilter | null;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase implements UseCaseInterface<
  ListCategoriesInput,
  ListCategoriesOutput
> {
  private readonly categoryRepository: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult.toJSON();
    const items = _items.map(item => CategoryOutputMapper.toOutput(item));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
