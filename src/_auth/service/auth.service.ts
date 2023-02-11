import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<{status: string, message: string} | {accessToken: string} | boolean>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     if(!detectUser) return {status: 'not Found', message: JSON.stringify(detectUser)};
     const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
     if(!checkHashPassword) return {status: 'not Found', message: JSON.stringify(checkHashPassword)};
     const accessToken = jwt.sign({id: detectUser.id.toString()}, process.env.JWT_SECRET as string, {expiresIn: '30d'})
     return {accessToken}
   }catch (e) {
     console.log(e)
     return false
   }
  }
}
