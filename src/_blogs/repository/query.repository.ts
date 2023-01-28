import {BlogModel} from '../model/blog.model';
import {DB} from '../../DB';
import {DB_NAME_COLLECTION_BLOG} from '../../constants';
import {ObjectId, WithId} from 'mongodb';

export const queryBlogsRepository = {
  async getAllBlogs (): Promise<BlogModel[]> {
    const blogs = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).find({}).toArray();
    return blogs.map(this._mapBlogs)
  },
  async getBlogById (id: string): Promise<BlogModel | null> {
    const currentBlog = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).findOne({_id: new ObjectId(id)});
    if(!currentBlog) return null;
    return this._mapBlogs(currentBlog);
  },
  _mapBlogs(blog: WithId<BlogModel> ): BlogModel{
    return {
      id: blog?.id || blog?._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    }
  }
}
