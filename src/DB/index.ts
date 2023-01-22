import {Collection, Db, MongoClient} from 'mongodb';
import {Document} from 'bson';

const uri = process.env.MONGO_DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'incubator';
export const client = new MongoClient(uri);

export const DB = <T extends Document = Document> (collection: string): Collection<T> => client.db(dbName).collection<T>(collection);

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
