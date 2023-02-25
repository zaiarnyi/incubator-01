import {Document} from 'bson';
import {LikeStatus} from '../../_comments/entity/likesStatusComments.entity';

interface itemPosts extends Document {
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  }
}

export interface IGetCommentForPost {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: itemPosts[]
}
