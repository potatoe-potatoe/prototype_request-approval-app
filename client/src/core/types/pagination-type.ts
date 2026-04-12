export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface PagedResult<T> {
  data: T[];
  pagination: PaginationMetadata;
}
