import {CreatePostModel, FullPostModal} from '../model/post.model';
import {queryBlogsRepository} from '../../_blogs/repository/query.repository';
import {ICommentDto} from '../../_comments/dto/comment.dto';
import {IUserEntity} from '../../_users/Entity/user.entity';
import {WithId} from 'mongodb';
import {ICommentModel} from '../../_comments/entity/commen.entity';
import {CommentsRepository} from '../../_comments/repository/comments.repository';
import {PostRepository} from '../repository/post.repository';
import {CommentQueryRepository} from '../../_comments/repository/query.repository';
import {ILikesCountInterface, INewestLikes} from '../interfaces/likesCount.interface';
import {LikeStatus, LikeStatusCommentsEntity} from '../../_comments/entity/likesStatusComments.entity';

export class PostServices {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postRepository: PostRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}
  async createPost(body: CreatePostModel, userId: string, login: string): Promise<FullPostModal>{
    const blog = await queryBlogsRepository.getBlogById(body.blogId);
    const newPost = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: blog?.name || '',
      createdAt: new Date().toISOString(),
    }
    const result = await this.postRepository.createPost({...newPost});
    const extendedLikesInfo = this.likesPostInfo(0, 0, LikeStatus.None, []);
    const likesInfoEntity = new LikeStatusCommentsEntity();
    likesInfoEntity.userId = userId
    likesInfoEntity.like = false;
    likesInfoEntity.dislike = false;
    likesInfoEntity.myStatus = LikeStatus.None;
    likesInfoEntity.postId = result.insertedId.toString();
    likesInfoEntity.login = login;
    await likesInfoEntity.save();
    return {...newPost, id: result.insertedId.toString(), extendedLikesInfo}
  }
  async updatePost(id: string, body: CreatePostModel): Promise<boolean>{
    const result = await this.postRepository.updatePost(id, body);
    return result.ok === 1;
  }
  async deletePost(id:string): Promise<boolean>{
    const resultDelete = await this.postRepository.deletePost(id);
    return resultDelete.deletedCount === 1;
  }
  async deletePosts(): Promise<void>{
    await this.postRepository.deletePosts();
  }
  async createCommentToPost(dto: ICommentDto, postId: string, {id, login}: IUserEntity){
    const body = {
      content: dto.content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: id.toString(),
        userLogin: login,
      },
      postId,
    }
    await this.commentsRepository.createCommentToPost(body);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
    }
    return this._mapCommentForPost(body as WithId<ICommentModel>, likesInfo);
  }

  async updateStatusCommentToPost(userId: string, postId: string, status: string){
    const like = LikeStatus.Like === status;
    const dislike = LikeStatus.Dislike === status;

    const update = await LikeStatusCommentsEntity.updateOne({postId}, {dislike, like, myStatus: status});
    return update;
  }
  _mapCommentForPost(body: WithId<ICommentModel>, likesInfo: ILikesCountInterface): Omit<ICommentModel & {likesInfo: ILikesCountInterface}, "postId">{
    return {
      content: body.content,
      createdAt: body.createdAt,
      commentatorInfo: { userId: body.commentatorInfo.userId, userLogin:  body.commentatorInfo.userLogin },
      id: body._id.toString(),
      likesInfo,
    }
  }
  likesPostInfo(likesCount: number, dislikeCount: number, myStatus: string, newestLikes: INewestLikes[]){
    return {
      likesCount: likesCount,
      dislikesCount: dislikeCount,
      myStatus: myStatus,
      newestLikes: newestLikes
    }
  }
}
