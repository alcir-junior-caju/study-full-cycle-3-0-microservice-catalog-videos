import { SearchParams } from "../repository/SearchParams";

describe('SearchParams Tests', () => {
  test.each([
    { page: null, expected: 1 },
    { page: undefined, expected: 1 },
    { page: '', expected: 1 },
    { page: 'fake', expected: 1 },
    { page: 0, expected: 1 },
    { page: -1, expected: 1 },
    { page: 5.5, expected: 1 },
    { page: true, expected: 1 },
    { page: false, expected: 1 },
    { page: {}, expected: 1 },
    { page: 1, expected: 1 },
    { page: 2, expected: 2 },
  ])('page param %p', ({ page, expected }) => {
    const searchParams = new SearchParams({ page: page as any });
    expect(searchParams.page).toBe(expected);
  });

  test.each([
    { perPage: null, expected: 15 },
    { perPage: undefined, expected: 15 },
    { perPage: '', expected: 15 },
    { perPage: 'fake', expected: 15 },
    { perPage: 0, expected: 15 },
    { perPage: -1, expected: 15 },
    { perPage: 5.5, expected: 15 },
    { perPage: true, expected: 15 },
    { perPage: false, expected: 15 },
    { perPage: {}, expected: 15 },
    { perPage: 1, expected: 1 },
    { perPage: 2, expected: 2 },
  ])('perPage param %p', ({ perPage, expected }) => {
    const searchParams = new SearchParams({ perPage: perPage as any });
    expect(searchParams.perPage).toBe(expected);
  });

  test.each([
    { sort: null, expected: null },
    { sort: undefined, expected: null },
    { sort: '', expected: null },
    { sort: 'fake', expected: 'fake' },
    { sort: 0, expected: '0' },
    { sort: -1, expected: '-1' },
    { sort: 5.5, expected: '5.5' },
    { sort: true, expected: 'true' },
    { sort: false, expected: 'false' },
    { sort: {}, expected: '[object Object]' },
    { sort: 'name', expected: 'name' },
  ])('sort param %p', ({ sort, expected }) => {
    const searchParams = new SearchParams({ sort: sort as any });
    expect(searchParams.sort).toBe(expected);
  });

  test.each([
    { sortDirection: {}, expected: null },
    { sortDirection: null, expected: null },
    { sortDirection: undefined, expected: null },
    { sortDirection: '', expected: null },
  ])('sortDirection param %p', ({ sortDirection, expected }) => {
    const searchParams = new SearchParams({ sortDirection: sortDirection as any });
    expect(searchParams.sortDirection).toBe(expected);
  });

  test.each([
    { sort: 'field', sortDirection: null, expected: 'asc'},
    { sort: 'field', sortDirection: undefined, expected: 'asc'},
    { sort: 'field', sortDirection: '', expected: 'asc'},
    { sort: 'field', sortDirection: 0, expected: 'asc'},
    { sort: 'field', sortDirection: 'fake', expected: 'asc'},
    { sort: 'field', sortDirection: 'asc', expected: 'asc'},
    { sort: 'field', sortDirection: 'ASC', expected: 'asc'},
    { sort: 'field', sortDirection: 'desc', expected: 'desc'},
    { sort: 'field', sortDirection: 'DESC', expected: 'desc'},
  ])('sortDirection param with sort %p', ({ sort, sortDirection, expected }) => {
    const searchParams = new SearchParams({ sort, sortDirection: sortDirection as any});
    expect(searchParams.sortDirection).toBe(expected);
  });

  test.each([
    { filter: null, expected: null },
    { filter: undefined, expected: null },
    { filter: '', expected: null },
    { filter: 'fake', expected: 'fake' },
    { filter: 0, expected: '0' },
    { filter: -1, expected: '-1' },
    { filter: 5.5, expected: '5.5' },
    { filter: true, expected: 'true' },
    { filter: false, expected: 'false' },
    { filter: {}, expected: '[object Object]' },
    { filter: 'field', expected: 'field' },
  ])('filter param %p', ({ filter, expected }) => {
    const searchParams = new SearchParams({ filter: filter as any });
    expect(searchParams.filter).toBe(expected);
  });
});
