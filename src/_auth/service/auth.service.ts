import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<boolean>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     if(!detectUser) return false;
     return bcrypt.compare(password, detectUser.hash);
   }catch (e) {
     console.log(e)
     return false
   }
  }
}
