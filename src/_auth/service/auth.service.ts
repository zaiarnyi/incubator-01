import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<{status: boolean, message: string} | {accessToken: string, status: boolean}>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     if(!detectUser) return {status: false, message: JSON.stringify(detectUser)};
     const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
     if(!checkHashPassword) return {status: false, message: JSON.stringify(checkHashPassword)};
     const accessToken = jwt.sign({id: detectUser.id.toString()}, process.env.JWT_SECRET as string, {expiresIn: '30d'})
     return {accessToken, status: true}
   }catch (e) {
     console.log(e)
     return {status: false, message: JSON.stringify(e)};
   }
  }
}
