import {Db, MongoClient} from 'mongodb';

const uri = process.env.MONGO_DB_URL as string;
const client = new MongoClient(uri);

export async function runConnectionToMongo() {
  // Connect the client to the server (optional starting in v4.7)
  await client.connect();
  // Establish and verify connection
  const db: Db = await client.db(process.env.MONGO_DB_NAME as string);
  await db.command({ ping: 1 });
  return db;
}
