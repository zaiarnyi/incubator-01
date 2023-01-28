import {CreateBlogModel} from '../model/blog.model';
import {DB_NAME_COLLECTION_BLOG} from '../../constants';
import {DB} from '../../DB';
import {DeleteResult, InsertOneResult, ModifyResult, ObjectId} from 'mongodb';

export const blogRepository = {
  async createBlog (body: CreateBlogModel): Promise<InsertOneResult<{}>> {
    return DB<{}>(DB_NAME_COLLECTION_BLOG).insertOne(body)
  },
  async updateBlog (id: string, body: CreateBlogModel): Promise<ModifyResult<{}>> {
    return DB(DB_NAME_COLLECTION_BLOG).findOneAndUpdate({_id: new ObjectId(id)}, {$set: body}, {projection: {_id: 0}});
  },
  async deleteBlog (id: string): Promise<DeleteResult>{
    return DB(DB_NAME_COLLECTION_BLOG).deleteOne({_id: new ObjectId(id)})
  },
  async deleteBlogs (): Promise<DeleteResult> {
    return DB(DB_NAME_COLLECTION_BLOG).deleteMany({})
  }
}
