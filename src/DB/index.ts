import {Collection, Db, MongoClient} from 'mongodb';
import {Document} from 'bson';
import {PostModel} from '../_posts/model/post.model';
import {DB_NAME_COLLECTION_BLOG, DB_NAME_COLLECTION_PRODUCTS} from '../constants';
import {BlogModel} from '../_blogs/model/blog.model';

const uri = process.env.MONGO_DB_URL as string;
export const dbName = process.env.MONGO_DB_NAME as string;
export const client = new MongoClient(uri);

export const DB = <T extends Document = Document> (collection: string): Collection<T> => client.db(dbName).collection<T>(collection);
export const postsCollection = DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS)
export const blogsCollection = DB<BlogModel>(DB_NAME_COLLECTION_BLOG)

export async function runConnectionToMongo() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    const db: Db = await client.db(dbName);
    await db.command({ ping: 1 });
  }catch (e) {
    await client.close();
    throw new Error('error with connection to MongoDB')
  }
}

export const disconnectDB = async () => {
  await client.close()
}
