import {ICommentDto} from './dto/comment.dto';
import {DeleteResult, UpdateResult} from 'mongodb';
import {CommentsRepository} from './repository/comments.repository';


export class CommentService {
  constructor(private readonly commentsRepository: CommentsRepository) {
  }
  async updateComment(dto: ICommentDto, id: string): Promise<UpdateResult> {
    return this.commentsRepository.updateComment(dto, id)
  }
  async removeComments(id: string): Promise<DeleteResult>{
    return this.commentsRepository.removeComment(id);
  }
}
