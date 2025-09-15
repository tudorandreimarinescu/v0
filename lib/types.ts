export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface FilterState {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  sortBy?: "price" | "name" | "rating" | "created_at"
  sortOrder?: "ASC" | "DESC"
}

export interface PaginationState {
  page: number
  limit: number
  hasMore: boolean
  totalResults: number
}
