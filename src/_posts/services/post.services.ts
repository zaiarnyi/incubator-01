import {CreatePostModel, PostModel} from '../model/post.model';
import {queryBlogsRepository} from '../../_blogs/repository/query.repository';
import {ICommentDto} from '../../_comments/dto/comment.dto';
import {IUserEntity} from '../../_users/Entity/user.entity';
import {WithId} from 'mongodb';
import {ICommentModel} from '../../_comments/entity/commen.entity';
import {CommentsRepository} from '../../_comments/repository/comments.repository';
import {PostRepository} from '../repository/post.repository';
import {CommentQueryRepository} from '../../_comments/repository/query.repository';
import {ILikesCountInterface} from '../interfaces/likesCount.interface';

export class PostServices {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postRepository: PostRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}
  async createPost(body: CreatePostModel): Promise<PostModel>{
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
    return {...newPost, id: result.insertedId.toString()}
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
    const createComment = await this.commentsRepository.createCommentToPost(body);
    const likesInfo = await this.commentQueryRepository.checkLikeStatusCommentFromPost(postId, id.toString(), createComment.insertedId.toString());
    return this._mapCommentForPost(body as WithId<ICommentModel>, likesInfo);
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
}
