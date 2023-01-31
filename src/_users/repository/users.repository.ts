import {ICreateUser} from '../interfaces/createUser.interface';
import {usersCollection} from '../../DB';

export const usersRepository = {
  async createUser(user: ICreateUser){
    return usersCollection.insertOne({...user});
  }
}
