import {IModalUser} from '../interfaces/createUser.interface';
import bcrypt from 'bcrypt';
import {usersRepository} from '../repository/users.repository';
import {UserEntity, UserModel} from '../Model/user.model';
import {addMinutes} from '../../utils/helpers';

export const usersService = {
  async createUser(body: IModalUser): Promise<Omit<UserModel, "isConfirm" | "activation" | "hash"> | null>{
    try {
      const hash = await bcrypt.hash(body.password, 10);

      const user = new UserEntity();
      user.email = body.email;
      user.login = body.login;
      user.hash = hash;
      user.activation = {
        expireAt: addMinutes(new Date(), 60),
        code: '',
      };
      user.isConfirm = true;
      user.isSendEmail = true;
      await user.save();

      return {
        createdAt: user.createdAt,
        login: user.login,
        email: user.email,
        id: user.id
      }
    }catch (e) {
      return null;
    }
  }
}
