export const ITEMS_PER_PAGE = 6;

export function getPageCount(totalItems: number, perPage = ITEMS_PER_PAGE) {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function paginateItems<T>(items: T[], page: number, perPage = ITEMS_PER_PAGE) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * perPage;
  return items.slice(start, start + perPage);
}
