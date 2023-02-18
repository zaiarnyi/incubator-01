import {ICommentDto} from './dto/comment.dto';
import {commentsRepository} from './repository/comments.repository';
import {DeleteResult, UpdateResult} from 'mongodb';


export const commentService = {
  async updateComment(dto: ICommentDto, id: string): Promise<UpdateResult> {
    return commentsRepository.updateComment(dto, id)
  },
  async removeComments(id: string): Promise<DeleteResult>{
    return commentsRepository.removeComment(id);
  },
}
