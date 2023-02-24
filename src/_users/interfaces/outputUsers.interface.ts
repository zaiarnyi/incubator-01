import {UserEntity} from '../Entity/user.entity';

export interface IUserOutPut {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount:number;
  items: UserEntity[];
}
