import {ICommentDto} from '../dto/comment.dto';
import {commentsCollection} from '../../DB';
import {ObjectId} from 'mongodb';
import {ICommentModel} from '../model';

export const commentsRepository = {
  async updateComment (dto: ICommentDto, id: string){
    return commentsCollection.updateOne(
        {_id: new ObjectId(id)},
    {$set: {content: dto.content}})
  },
  async removeComment(id: string){
    return commentsCollection.deleteOne({_id: new ObjectId(id)});
  },
  async removeAllComments(){
    return commentsCollection.deleteMany({});
  },
  async createCommentToPost(body: Omit<ICommentModel, "id">){
    return commentsCollection.insertOne(body);
  }
}
