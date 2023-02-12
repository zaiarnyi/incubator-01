import {Document} from 'bson';


export interface IGetCommentForPost {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Document[]
}
