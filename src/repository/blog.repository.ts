import {BlogModel} from '../models/blog.model';
import {DB_NAME_COLLECTION_BLOG} from '../constants';
import {DB} from '../DB';

export const blogRepository = {
  async getAllBlogs (): Promise<BlogModel[] | undefined> {
    return DB<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .find({}, {projection: {_id: 0}})
      .toArray();
  },
  async getBlogById (id: string): Promise<BlogModel | undefined | null> {
    return DB<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .findOne({id}, {projection: {_id: 0}})
  },
  async createBlog (body: Omit<BlogModel, "id">): Promise<any> {
    const lastId = await DB(DB_NAME_COLLECTION_BLOG).countDocuments() || 0;
    const newBlog = {
      id: (lastId + 1).toString(),
      ...body,
    }
    const resultCreateBlog = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).insertOne({...newBlog});
    return resultCreateBlog.acknowledged && newBlog
  },
  async updateBlog (id: string, body: Omit<BlogModel, "id">): Promise<boolean> {
    const result = await DB(DB_NAME_COLLECTION_BLOG).findOneAndUpdate({id}, {$set: body});
    return result?.lastErrorObject?.updatedExisting;
  },
  async deleteBlog (id: string): Promise<boolean>{
    const resultDeleteBlogById = await DB(DB_NAME_COLLECTION_BLOG).deleteOne({id});
    return resultDeleteBlogById?.deletedCount === 1;
  },
  async deleteBlogs (): Promise<any> {
    return DB(DB_NAME_COLLECTION_BLOG).deleteMany({})
  }
}
