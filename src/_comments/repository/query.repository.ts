import {commentsCollection, usersCollection} from '../../DB';
import {ObjectId, WithId} from 'mongodb';
import {IPostIdComments} from '../interfaces/comment.interface';
import {IGetCommentForPost} from '../../_posts/interfaces';
import {ICommentModel} from '../model';

export const commentQueryRepository = {
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
  },
  async getUserComments(userId:string): Promise<WithId<ICommentModel> | null>{
    return commentsCollection.findOne( {
      "commentatorInfo.userId": userId
    });
  },

  async getCommentFromPost(postId: string, query: IPostIdComments): Promise<IGetCommentForPost>{
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
      .toArray();
    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments
    };
  }
}
