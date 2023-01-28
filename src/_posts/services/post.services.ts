import {CreatePostModel, PostModel} from '../model/post.model';
import {postRepository} from '../repository/post.repository';
import {queryBlogsRepository} from '../../_blogs/repository/query.repository';

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
  }
}
