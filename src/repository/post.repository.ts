import {PostModel} from '../models/post.model';
import {DB_NAME_COLLECTION_BLOG, DB_NAME_COLLECTION_PRODUCTS} from '../constants';
import {DB} from '../DB';
import {BlogModel} from '../models/blog.model';

export const postRepository = {
  async getAllPosts(): Promise<Array<PostModel> | undefined> {
    return DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS)
      .find({}, {projection: {_id: 0}})
      .toArray();
  },
  async getPostById (id: string): Promise<PostModel | undefined | null> {
    return DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS).findOne({id}, {projection: {_id: 0}});
  },
  async createPost (body: Omit<PostModel, "id" | "blogName">): Promise<PostModel | boolean | undefined> {
    const lastId = await DB(DB_NAME_COLLECTION_PRODUCTS).countDocuments() || 0;
    const blog = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).findOne({id: body.blogId},{projection: {name: 1, _id: 0}});
    const newPost = {
      id: (lastId + 1).toString(),
      blogName: blog?.name || '',
      ...body,
      createdAt: new Date().toISOString(),
    }
    const resultCreatePost = await DB(DB_NAME_COLLECTION_PRODUCTS).insertOne({...newPost});
    return resultCreatePost?.acknowledged && newPost;
  },
  async updatePost (id: string, body: Omit<PostModel, "id" | "blogName">): Promise<boolean> {const resultUpdatedPost = await DB(DB_NAME_COLLECTION_PRODUCTS).findOneAndUpdate({id}, {$set: {body}});
    return resultUpdatedPost?.lastErrorObject?.updatedExisting;
  },
  async deletePost (id: string): Promise<boolean>{const resultRemovePost = await DB(DB_NAME_COLLECTION_PRODUCTS).deleteOne({id});return resultRemovePost?.deletedCount === 1;
  },
  async deletePosts (): Promise<any> {
    return DB(DB_NAME_COLLECTION_PRODUCTS).deleteMany({});
  },
}
