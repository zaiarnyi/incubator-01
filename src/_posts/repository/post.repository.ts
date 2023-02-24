import {CreatePostModel, PostModel} from '../model/post.model';
import {DB_NAME_COLLECTION_PRODUCTS} from '../../constants';
import {DB} from '../../DB';
import {DeleteResult, InsertOneResult, ModifyResult, ObjectId,} from 'mongodb';

export class PostRepository {
  async createPost (body: Omit<PostModel, 'id'>): Promise<InsertOneResult<{}>>  {
    return DB<{}>(DB_NAME_COLLECTION_PRODUCTS).insertOne({...body});
  }
  async updatePost (id: string, body: CreatePostModel): Promise<ModifyResult<{}>> {
    return DB(DB_NAME_COLLECTION_PRODUCTS).findOneAndUpdate({_id: new ObjectId(id)}, {$set: {...body}});
  }
  async deletePost (id: string): Promise<DeleteResult>{
    return DB(DB_NAME_COLLECTION_PRODUCTS).deleteOne({_id: new ObjectId(id)});
  }
  async deletePosts (): Promise<DeleteResult> {
    return DB(DB_NAME_COLLECTION_PRODUCTS).deleteMany({});
  }
}
