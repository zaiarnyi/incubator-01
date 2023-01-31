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
  searchLoginTerm: string,
  searchEmailTerm: string,
  // searchEmail: {} | {email: {}},
  // searchLogin: {} | {login: {}},
  searchRegex: {} | {email?: {}, login?: {}},
  // sort: Record<string, string>,
  sortBy: string,
  sortDirection: direction,
  pageNumber: number,
  limit: number,
}
