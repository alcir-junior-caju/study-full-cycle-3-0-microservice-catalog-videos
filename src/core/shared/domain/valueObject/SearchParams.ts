import { ValueObject } from './ValueObject';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorParams<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  protected _page: number;
  protected _perPage: number = 15;
  protected _sort: string | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: Filter | null;

  constructor({
    page,
    perPage,
    sort,
    sortDirection,
    filter,
  }: SearchParamsConstructorParams<Filter> = {}) {
    super();
    this.page = page!;
    this.perPage = perPage!;
    this.sort = sort!;
    this.sortDirection = sortDirection!;
    this.filter = filter!;
  }

  get page(): number {
    return this._page;
  }

  private set page(page: number) {
    let _page = +page;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage(): number {
    return this._perPage;
  }

  private set perPage(perPage: number) {
    let _perPage = perPage === (true as any) ? this._perPage : +perPage;
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(sort: string | null) {
    this._sort =
      sort === null || sort === undefined || sort === '' ? null : `${sort}`;
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  private set sortDirection(sortDirection: SortDirection | null) {
    if (!this._sort) {
      this._sortDirection = null;
      return;
    }
    const dir = `${sortDirection}`.toLowerCase();
    this._sortDirection = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(filter: Filter | null) {
    this._filter =
      filter === null || filter === undefined || (filter as unknown) === ''
        ? null
        : (`${filter}` as any);
  }
}
