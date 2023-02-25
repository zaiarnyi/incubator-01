import {ICreateUser} from '../interfaces/createUser.interface';
import {DB, usersCollection} from '../../DB';
import {IUserEntity} from '../Entity/user.entity';
import {DB_NAME_COLLECTION_USERS} from '../../constants';
import {DeleteResult, InsertOneResult, ObjectId} from 'mongodb';


export const usersRepository = {
  async createUser(user: ICreateUser): Promise<InsertOneResult<ICreateUser | IUserEntity>>{
    return usersCollection.insertOne({...user});
  },
  async deleteUser(id: string): Promise<DeleteResult>{
    return DB<IUserEntity>(DB_NAME_COLLECTION_USERS).deleteOne({_id: new ObjectId(id)})
  },
  async deleteUserByEmail(email: string): Promise<DeleteResult>{
    return DB<IUserEntity>(DB_NAME_COLLECTION_USERS).deleteOne({email});
  },
  async deleteAllUsers():Promise<DeleteResult>{
    return usersCollection.deleteMany({});
  },
  async setIsSendEmailRegistration(email: string, value: boolean){
    return usersCollection.updateOne({email}, {$set: {isSendEmail: value}});
  }
}
