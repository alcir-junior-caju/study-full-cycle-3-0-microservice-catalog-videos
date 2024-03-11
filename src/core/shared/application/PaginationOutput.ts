import { SearchResult } from '../domain';

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    params: Omit<SearchResult, 'items'>,
  ): PaginationOutput<Item> {
    const { total, currentPage, lastPage, perPage } = params.toJSON();

    return {
      items,
      total,
      currentPage,
      lastPage,
      perPage,
    };
  }
}
