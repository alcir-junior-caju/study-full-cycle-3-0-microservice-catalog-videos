import { Entity } from "../entity";
import { ValueObject } from "./ValueObject";

export type SearchResultConstructorParams<E extends Entity> = {
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
  protected _lastPage: number;

  constructor({
    items,
    total,
    currentPage,
    perPage,
  }: SearchResultConstructorParams<E>) {
    super();
    this._items = items;
    this._total = total;
    this._currentPage = currentPage;
    this._perPage = perPage;
    this._lastPage = Math.ceil(total / perPage);
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this._items.map((item) => item.toJSON()) : this._items,
      total: this._total,
      currentPage: this._currentPage,
      perPage: this._perPage,
      lastPage: this._lastPage,
    };
  }
}
