import {DEFAULT_PAGE_SIZE} from '../constants';
import {IQueryParamsOutPut, IQueryParamsUsers} from '../_users/interfaces/params.interface';

export const mappingQueryParamsUsers = (query: IQueryParamsUsers) : IQueryParamsOutPut => {
  const searchLoginTerm = query.searchLoginTerm || '';
  const searchEmailTerm = query.searchEmailTerm || '';
  const sortBy = query.sortBy || 'createdAt';
  const sortDirection = query.sortDirection || 'desc';
  const pageNumber = +(query.pageNumber || 1);
  const limit = +(query.pageSize || DEFAULT_PAGE_SIZE);
  const searchRegex = {$or: [
      {login: {$regex: new RegExp(searchLoginTerm, 'gi')}},
      {email: {$regex: new RegExp(searchEmailTerm, 'gi')}}
    ]};
  return {
    searchRegex,
    pageNumber,
    limit,
    sortBy,
    sortDirection
  }
}
