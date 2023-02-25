import {ICommentDto} from '../dto/comment.dto';
import {commentsCollection} from '../../DB';
import {InsertOneResult, ObjectId, WithId} from 'mongodb';
import {ICommentModel} from '../entity/commen.entity';

export class CommentsRepository {
  async updateComment (dto: ICommentDto, id: string){
    return commentsCollection.updateOne(
        {_id: new ObjectId(id)},
    {$set: {content: dto.content}})
  }
  async removeComment(id: string){
    return commentsCollection.deleteOne({_id: new ObjectId(id)});
  }
  public static async removeAllComments(){
    return commentsCollection.deleteMany({});
  }
  async createCommentToPost(body: Omit<ICommentModel, "id">): Promise<InsertOneResult<ICommentModel>>{
    return commentsCollection.insertOne(body);
  }
}
