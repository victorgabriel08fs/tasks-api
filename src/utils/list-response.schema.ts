export interface ListResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    sortBy?: { key: string; direction: string } | {};
    search?: { field: string; value: string } | {};
    filteredTotal?: number;
  };
}
