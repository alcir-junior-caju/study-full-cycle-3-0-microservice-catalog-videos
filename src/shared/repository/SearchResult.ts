import { Entity, ValueObject } from "../domain";

export type SearchResultContructorParams<E extends Entity> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
};

export class SearchResult<E extends Entity = Entity> extends ValueObject {
  protected _items: E[];
  protected _total: number;
  protected _currentPage: number;
  protected _perPage: number;
  protected lastPage: number;

  constructor({
    items,
    total,
    currentPage,
    perPage,
  }: SearchResultContructorParams<E>) {
    super();
    this._items = items;
    this._total = total;
    this._currentPage = currentPage;
    this._perPage = perPage;
    this.lastPage = Math.ceil(total / perPage);
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this._items.map((item) => item.toJSON()) : this._items,
      total: this._total,
      currentPage: this._currentPage,
      perPage: this._perPage,
      lastPage: this.lastPage,
    };
  }
}
