import {commentsCollection, usersCollection} from '../../DB';
import {ObjectId, WithId} from 'mongodb';
import {IPostIdComments} from '../interfaces/comment.interface';
import {IGetCommentForPost} from '../../_posts/interfaces';
import {ICommentModel} from '../entity/commen.entity';
import {LikeStatus, LikeStatusCommentsEntity} from '../entity/likesStatusComments.entity';
import {LikeStatusPostEntity} from '../../_posts/model/likePostStatuse.entity';

export class CommentQueryRepository {
  async getById(id: string): Promise<WithId<ICommentModel> | null>{
    return commentsCollection.findOne({_id: new ObjectId(id)},
      {projection: {
                id: "$_id",
                _id: 0,
                content: 1,
                commentatorInfo: 1,
                createdAt: 1,
              }}
    )
  }
  async getUserComments(userId:string): Promise<WithId<ICommentModel> | null>{
    return commentsCollection.findOne( {
      "commentatorInfo.userId": userId
    });
  }

  async getCommentFromPost(postId: string, query: IPostIdComments, userId: string): Promise<IGetCommentForPost>{
    // Sort
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection || 'desc';
    // Math
    const pageSize = +(query.pageSize || 10);
    const pageNumber = +(query.pageNumber || 1)
    const totalCount = await commentsCollection.countDocuments({postId});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    const comments = await commentsCollection.find({postId})
      .project({id: "$_id", _id: 0, content: 1, commentatorInfo: 1, createdAt: 1})
      .sort(sortBy, sortDirection)
      .limit(pageSize)
      .skip(skip)
      .toArray()

    const items = await Promise.all(comments.map( async (item)=> {
      const likesInfo = await this.checkLikeStatusCommentFromPost(postId, userId, item.id.toString());
      return {
        ...item,
        likesInfo
      }
    }));

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items
    };
  }

  async checkLikeStatusCommentFromPost(postId: string, userId: string,commentId: string = ''){
    const dislike = LikeStatus.Dislike.toLowerCase()
    const like = LikeStatus.Like.toLowerCase();
    const [likesCount, dislikesCount, status] = await Promise.all([
      this.prepareStatus(postId, like, commentId),
      this.prepareStatus(postId, dislike, commentId),
      this.prepareMyStatus(postId, userId, commentId)])

    return {
      likesCount,
      dislikesCount,
      myStatus: status?.myStatus || LikeStatus.None,
    }
  }
  async prepareStatus(postId: string, status: string, commentId: string = ''){
    if(!commentId){
      return 0;
    }
    return LikeStatusPostEntity.find({postId, commentId, [status]: true}).count();
  }
  async prepareMyStatus(postId: string, userId: string, commentId: string = ''){
    if(!commentId){
      return null
    }
    return LikeStatusPostEntity.findOne({postId, userId, commentId})
  }
}
