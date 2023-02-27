import {LikeStatus} from '../../_comments/entity/likesStatusComments.entity';

export interface ILikesCountInterface {
  "likesCount": number;
  "dislikesCount": number;
  "myStatus": LikeStatus
}

export interface INewestLikes {
  addedAt: Date;
  userId: string;
  login: string;
}
