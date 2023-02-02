import {DEFAULT_PAGE_SIZE} from '../constants';
import {IQueryParamsOutPut, IQueryParamsUsers} from '../_users/interfaces/params.interface';

export const mappingQueryParamsUsers = (query: IQueryParamsUsers) : IQueryParamsOutPut => {
  const searchLoginTerm = query.searchLoginTerm || '';
  const searchEmailTerm = query.searchEmailTerm || '';
  const sortBy = query.sortBy || 'createdAt';
  const sortDirection = query.sortDirection || 'desc';
  const pageNumber = +(query.pageNumber || 1);
  const limit = +(query.pageSize || DEFAULT_PAGE_SIZE);
  const searchRegex = {$or: []};
  if(searchLoginTerm.length){
    const loginTerm = {login: {$regex: new RegExp(searchLoginTerm, 'gi')}};
    // @ts-ignore
    searchRegex.$or.push(loginTerm)
  }
  if(searchEmailTerm.length){
    const emailTerm =  {email: {$regex: new RegExp(searchEmailTerm, 'gi')}}
    // @ts-ignore
    searchRegex.$or.push(emailTerm);
  }
// ...(searchLoginTerm.length && {login: {$regex: new RegExp(searchLoginTerm, 'gi')}}),
// ...(searchEmailTerm.length && {email: {$regex: new RegExp(searchEmailTerm, 'gi')}})

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
