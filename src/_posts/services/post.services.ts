import {CreatePostModel, PostModel} from '../model/post.model';
import {postRepository} from '../repository/post.repository';
import {queryBlogsRepository} from '../../_blogs/repository/query.repository';
import {ICommentDto} from '../../_comments/dto/comment.dto';
import {UserModel} from '../../_users/Model/user.model';
import {commentsRepository} from '../../_comments/repository/comments.repository';
import {WithId} from 'mongodb';
import {ICommentModel} from '../../_comments/model';

export const postServices = {
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
    const result = await postRepository.createPost({...newPost});
    return {...newPost, id: result.insertedId.toString()}
  },
  async updatePost(id: string, body: CreatePostModel): Promise<boolean>{
    const result = await postRepository.updatePost(id, body);
    return result.ok === 1;
  },
  async deletePost(id:string): Promise<boolean>{
    const resultDelete = await postRepository.deletePost(id);
    return resultDelete.deletedCount === 1;
  },
  async deletePosts(): Promise<void>{
    await postRepository.deletePosts();
  },
  async createCommentToPost(dto: ICommentDto, postId: string, {id, login}: UserModel){
    const body = {
      content: dto.content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: id.toString(),
        userLogin: login,
      },
      postId,
    }
    await commentsRepository.createCommentToPost(body);
    return this._mapCommentForPost(body as WithId<ICommentModel>);
  },
  _mapCommentForPost(body: WithId<ICommentModel>): Omit<ICommentModel, "postId">{
    return {
      content: body.content,
      createdAt: body.createdAt,
      commentatorInfo: { userId: body.commentatorInfo.userId, userLogin:  body.commentatorInfo.userLogin },
      id: body._id.toString()
    }
  }
}
