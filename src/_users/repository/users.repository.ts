import {ICreateUser} from '../interfaces/createUser.interface';
import {DB, usersCollection} from '../../DB';
import {UserModel} from '../Model/user.model';
import {DB_NAME_COLLECTION_USERS} from '../../constants';
import {DeleteResult, InsertOneResult, ObjectId, WithId} from 'mongodb';

export const usersRepository = {
  async createUser(user: ICreateUser): Promise<InsertOneResult<ICreateUser | UserModel>>{
    return usersCollection.insertOne({...user});
  },
  async deleteUser(id: string): Promise<DeleteResult>{
    return DB<UserModel>(DB_NAME_COLLECTION_USERS).deleteOne({_id: new ObjectId(id)})
  },
  async deleteAllUsers():Promise<DeleteResult>{
    return usersCollection.deleteMany({});
  }
}
