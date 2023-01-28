import {PostModel} from '../model/post.model';
import {DB, postsCollection} from '../../DB';
import {DB_NAME_COLLECTION_PRODUCTS} from '../../constants';
import {ObjectId, WithId} from 'mongodb';

export const queryRepository = {
  async getAllPosts(): Promise<PostModel[] | null> {
    const posts = await DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS).find({}).toArray();
    return posts.map(this._mapPosts);
  },
  async getPostById (id: string): Promise<PostModel | null> {
    const post = await postsCollection.findOne({_id: new ObjectId(id)});
    if(!post) return null;
    return this._mapPosts(post);
  },
  _mapPosts(post: WithId<PostModel>): PostModel{
    return {
      id: (post?.id || post?._id)?.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    }
  }
}
