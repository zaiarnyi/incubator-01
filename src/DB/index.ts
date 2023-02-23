import {Collection, Db, MongoClient} from 'mongodb';
import * as mongoose from 'mongoose';
import {Document} from 'bson';
import {PostModel} from '../_posts/model/post.model';
import {
  DB_NAME_COLLECTION_BLOG,
  DB_NAME_COLLECTION_COMMENTS,
  DB_NAME_COLLECTION_PRODUCTS,
  DB_NAME_COLLECTION_SECURITY,
  DB_NAME_COLLECTION_USERS,
  DB_NAME_REFRESH_TOKEN_LIST
} from '../constants';
import {BlogModel} from '../_blogs/model/blog.model';
import {UserModel} from '../_users/Model/user.model';
import {ICreateUser} from '../_users/interfaces/createUser.interface';
import {ICommentModel} from '../_comments/model';
import {IRefreshListInterface} from '../_auth/interfaces/refreshList.interface';
import {ISecurityModel} from '../_security/Model/security.model';

const uri = process.env.MONGO_DB_URL as string;
export const dbName = process.env.MONGO_DB_NAME as string;
export const client = new MongoClient(uri);

export const DB = <T extends Document = Document> (collection: string): Collection<T> => client.db(dbName).collection<T>(collection);
export const postsCollection = DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS)
export const blogsCollection = DB<BlogModel>(DB_NAME_COLLECTION_BLOG)
export const usersCollection = DB<ICreateUser | UserModel>(DB_NAME_COLLECTION_USERS)
export const refreshTokenListCollection = DB<IRefreshListInterface>(DB_NAME_REFRESH_TOKEN_LIST)
export const commentsCollection = DB<ICommentModel>(DB_NAME_COLLECTION_COMMENTS)
export const securityCollection = DB<ISecurityModel>(DB_NAME_COLLECTION_SECURITY)



export async function runConnectionToMongo() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    await mongoose.set('strictQuery', false).connect(uri + '/' +  dbName);
    // Establish and verify connection
    const db: Db = await client.db(dbName);
    await db.command({ ping: 1 });
  }catch (e) {
    await client.close();
    await mongoose.disconnect()
    throw new Error('error with connection to MongoDB')
  }
}

export const disconnectDB = async () => {
  await client.close()
}
