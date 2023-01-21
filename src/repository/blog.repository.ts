import {BlogModel} from '../models/blog.model';
import {DB} from '../index';
import {DB_NAME_COLLECTION_BLOG} from '../constants';

export const blogRepository = {
  async getAllBlogs (): Promise<BlogModel[] | [] | undefined> {
    return DB?.collection<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .find({}, {projection: {_id: 0}})
      .limit(10)
      .toArray();
  },
  async getBlogById (id: string): Promise<BlogModel | undefined | null> {
    return DB?.collection<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .findOne({id}, {projection: {_id: 0}})
  },
  async createBlog (body: Omit<BlogModel, "id">): Promise<BlogModel> {
    const lastId = await DB?.collection(DB_NAME_COLLECTION_BLOG).countDocuments() || 0;
    const newBlog = {
      id: (lastId + 1).toString(),
      ...body,
    }
    await DB?.collection<BlogModel>(DB_NAME_COLLECTION_BLOG).insertOne({...newBlog});
    return newBlog;
  },
  async updateBlog (id: string, body: Omit<BlogModel, "id">): Promise<boolean> {
    const result = await DB?.collection(DB_NAME_COLLECTION_BLOG).updateOne({id}, {$set: body});
    return result?.modifiedCount === 1;
  },
  async deleteBlog (id: string): Promise<boolean>{
    const resultDeleteBlogById = await DB?.collection(DB_NAME_COLLECTION_BLOG).deleteOne({id});
    return resultDeleteBlogById?.deletedCount === 1;
  },
  async deleteBlogs (): Promise<void> {
    await DB?.collection('blogs').deleteMany({});
  }
}
