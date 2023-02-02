type direction = 'asc' | 'desc' | 1 | -1;

export interface IQueryParamsUsers {
  searchLoginTerm?: string,
  searchEmailTerm?: string,
  sortBy?: string,
  sortDirection?: direction,
  pageNumber?: string,
  pageSize?: string,
}
export interface IQueryParamsOutPut {
  searchRegex: {} | {email?: {}, login?: {}},
  sortBy: string,
  sortDirection: direction,
  pageNumber: number,
  limit: number,
}
