import {IModalUser} from '../interfaces/createUser.interface';
import bcrypt from 'bcrypt';
import {usersRepository} from '../repository/users.repository';
import {UserModel} from '../Model/user.model';

export const usersService = {
  async createUser(body: IModalUser): Promise<Omit<UserModel, "isConfirm" | "activation"> | null>{
    const hash = await bcrypt.hash(body.password, 10);
    const user = {
      createdAt: new Date().toISOString(),
      hash,
      login: body.login,
      email: body.email,
      isConfirm: true,
    }
    const result = await usersRepository.createUser(user);
    if(!result.insertedId){
      return null;
    }
    return {
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
      id: result.insertedId.toString()
    }
  }

}
