import {commentsCollection, usersCollection} from '../../DB';
import {ObjectId} from 'mongodb';
import {IPostIdComments} from '../interfaces/comment.interface';

export const commentQueryRepository = {
  async getById(id: string){
    console.log(id, 'id')
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
  async getUserComments(userId:string){
    console.log(userId)
    return commentsCollection.findOne( {
      "commentatorInfo.userId": userId
    });
  },

  async getCommentFromPost(postId: string, query: IPostIdComments){
    // Sort
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection || 'desc';
    // Math
    const pageSize = +(query.pageSize || 10);
    const pageNumber = +(query.pageNumber || 1)
    const totalCount = await commentsCollection.countDocuments();
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
