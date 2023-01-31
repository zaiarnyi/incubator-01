import {UserModel} from '../Model/user.model';

export interface IUserOutPut {
  pagesCount: number;
  pageNumber: number;
  limit: number;
  totalCount:number;
  items: UserModel[];
}
