import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<boolean | {accessToken: string}>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     console.log(detectUser, 'detectUser')
     if(!detectUser) return false;
     const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
     console.log(checkHashPassword, 'checkHashPasswordcheckHashPasswordcheckHashPasswordcheckHashPassword')
     if(!checkHashPassword) return false;
     const accessToken = jwt.sign({id: detectUser.id.toString()}, "123", {expiresIn: '1h'})
     return {accessToken}
   }catch (e) {
     console.log(e)
     return false
   }
  }
}
