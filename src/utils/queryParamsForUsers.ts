import {DEFAULT_PAGE_SIZE} from '../constants';
import {IQueryParamsOutPut, IQueryParamsUsers} from '../_users/interfaces/params.interface';

export const mappingQueryParamsBlogsAndPosts = (query: IQueryParamsUsers) : IQueryParamsOutPut => {
  const searchLoginTerm = query.searchLoginTerm || '';
  const searchEmailTerm = query.searchEmailTerm || '';
  const sortBy = query.sortBy || 'createdAt';
  const sortDirection = query.sortDirection || 'desc';
  const pageNumber = +(query.pageNumber || 1);
  const limit = +(query.pageSize || DEFAULT_PAGE_SIZE);
  const searchRegex = {
    ...(searchLoginTerm.length && {login: {$regex: searchLoginTerm, $options: 'i'}}),
    ...(searchEmailTerm.length && {email: {$regex: searchEmailTerm, $options: 'i'}})
  }
  // const sort = {
  //   [sortBy as string]: sortDirection as string
  // }
  return {
    searchLoginTerm,
    searchEmailTerm,
    searchRegex,
    // sort,
    pageNumber,
    limit,
    sortBy,
    sortDirection
  }
}
