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
      const savedUser = await user.save();
      return {
        createdAt: savedUser.createdAt,
        login: savedUser.login,
        email: savedUser.email,
        id: savedUser._id.toString(),
      }
    }catch (e) {
      return null;
    }
  }
}
