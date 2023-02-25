import {ICommentDto} from './dto/comment.dto';
import {DeleteResult, UpdateResult} from 'mongodb';
import {CommentsRepository} from './repository/comments.repository';
import {LikeStatus, LikeStatusCommentsEntity} from './entity/likesStatusComments.entity';
import {CommentEntity} from './entity/commen.entity';


export class CommentService {
  constructor(private readonly commentsRepository: CommentsRepository) {
  }
  async updateComment(dto: ICommentDto, id: string): Promise<UpdateResult> {
    return this.commentsRepository.updateComment(dto, id)
  }
  async removeComments(id: string): Promise<DeleteResult>{
    return this.commentsRepository.removeComment(id);
  }
  async setLikeStatus(userId: string, status: LikeStatus, commentId: string): Promise<boolean | null>{
    const [comment, findCommentStatus] = await Promise.all([
      CommentEntity.findById(commentId), LikeStatusCommentsEntity.findOne({userId, commentId})]);

    if(!comment){
      return null
    }
    const like = status === LikeStatus.Like;
    const dislike = status === LikeStatus.Dislike;
    if(findCommentStatus){
      const updated = await LikeStatusCommentsEntity.updateOne({commentId, userId}, {like, dislike, myStatus: status});
      return updated.modifiedCount === 1;
    }
    const likeStatus = new LikeStatusCommentsEntity();
    likeStatus.userId = userId;
    likeStatus.like = like;
    likeStatus.dislike = dislike;
    likeStatus.myStatus = status;
    likeStatus.commentId = commentId;

    return !!(await likeStatus.save());
  }

  async getStatisticsLikeStatus(commentId: string, userId: string){
    const dislike = LikeStatus.Dislike.toLowerCase()
    const like = LikeStatus.Like.toLowerCase();
    const [likesCount, dislikesCount, status] = await Promise.all([
      this.prepareStatus(commentId, like),
      this.prepareStatus(commentId, dislike),
      this.prepareMyStatus(commentId, userId)])

    return {
      likesCount,
      dislikesCount,
      myStatus: status?.myStatus || LikeStatus.None,
    }
  }

  async prepareStatus(commentId: string, status: string){
    return LikeStatusCommentsEntity.find({commentId, [status]: true}).count();
  }
  async prepareMyStatus(commentId: string, userId: string){
    return LikeStatusCommentsEntity.findOne({commentId, userId})
  }
}
