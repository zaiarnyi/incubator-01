import {DEFAULT_PAGE_SIZE} from '../constants';

export interface QueryParamsGet {
  searchNameTerm?: string,
  sortBy?: string,
  sortDirection?: string,
  pageNumber?: string,
  pageSize?: string,
}
interface QueryParamsOutPut {
  searchNameTerm: string,
  searchRegex: {} | {name: {}},
  sort: {
    [key: string]: 'asc' | 'desc' | 1 | -1
  }
  pageNumber: number,
  limit: number,
}

export const mappingQueryParamsBlogsAndPosts = (query: QueryParamsGet) : QueryParamsOutPut => {
  const searchNameTerm = query.searchNameTerm || '';
  const sortBy = query.sortBy || 'createdAt';
  const sortDirection = query?.sortDirection || 'asc';
  const pageNumber = +(query.pageNumber || 1);
  const limit = +(query.pageSize || DEFAULT_PAGE_SIZE);
  const searchRegex = {
    ...(searchNameTerm.length && {name: {$regex: searchNameTerm, $options: 'i'}})
  }
  const sort = {
    [sortBy]: sortDirection as number | string
  }
  return <QueryParamsOutPut>{
    searchNameTerm,
    searchRegex,
    sort,
    pageNumber,
    limit,
  }
}
