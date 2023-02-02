import {UserModel} from '../Model/user.model';

export interface IUserOutPut {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount:number;
  items: UserModel[];
}
