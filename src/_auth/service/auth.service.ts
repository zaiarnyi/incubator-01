import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';
import {IRegistrationDto} from '../dto/registration.dto';
import {generateCode} from '../../utils/generateConfirmCode';
import {emailService} from '../../_email/email.service';
import {usersRepository} from '../../_users/repository/users.repository';
import {addMinutes} from '../../utils/helpers';
import {refreshTokenListCollection, usersCollection} from '../../DB';
import { UpdateResult } from 'mongodb';
import {UserFromJWT} from '../../types/authTypes';

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<null | {accessToken: string, refreshToken: string}>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     if(!detectUser) return null;
     const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
     if(!checkHashPassword) return null;
     const {accessToken, refreshToken} = this.generateTokens(detectUser.id.toString());
     return {accessToken, refreshToken}
   }catch (e) {
     console.log(e)
     return null
   }
  },
  async registrationUser(body: IRegistrationDto): Promise<null | boolean>{
    const code = generateCode();
    const passwordHash = await bcrypt.hash(body.password, 10);
    emailService.registrationEmail(body.email, code)
      .then(()=> {
      usersRepository.setIsSendEmailRegistration(body.email, true);
    });

    const user = {
      email: body.email,
      login: body.login,
      hash: passwordHash,
      activation:{
        expireAt: addMinutes(new Date(), 60).getTime(),
        code
      },
      isConfirm: false,
      createdAt: new Date().toISOString(),
      isSendEmail: false,
    }
    const createdUser = await usersRepository.createUser({...user});
    return !!createdUser.insertedId;
  },
  async confirmUser(code: string){
    return usersCollection.updateOne({"activation.code": code}, {$set: {isConfirm: true}});
  },
  async resendConfirmCode(email: string): Promise<UpdateResult | null>{
    const code = generateCode();
    emailService.registrationEmail(email, code)
      .then(()=> {
        usersRepository.setIsSendEmailRegistration(email, true);
      });

    return usersCollection.updateOne({email}, {$set:
        {
          "activation.code": code,
          "activation.expireAt": addMinutes(new Date(), 60).getTime(),
          isSendEmail: false,
        }
    })
  },
  async changeUserTokens(refresh: string): Promise<null | {accessToken: string, refreshToken: string}>{
   try {
     const userVerify = jwt.verify(refresh, process.env.JWT_SECRET as string) as UserFromJWT;
     const user = await userQueryRepository.getUserById(userVerify.id);
     if(!user) return null;
     await this.addRefreshTokenToList(userVerify.id, refresh);
     const {accessToken, refreshToken} = this.generateTokens(userVerify.id.toString());
     return {accessToken, refreshToken}
   }catch (e) {
     return null
   }
  },
  generateTokens(id: string): {accessToken: string, refreshToken: string}{
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: '10s'})
    const refreshToken = jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: '20s'})
    return {accessToken, refreshToken}
  },
  async addRefreshTokenToList(userId: string, token: string){
    const isUpdated = await refreshTokenListCollection.findOneAndUpdate({userId},
      {$push: {token_list: token}}
    )
    if(isUpdated.value) return isUpdated;
    return refreshTokenListCollection.insertOne({userId, token_list: [token]})
  },
  async removeUserIsNotConfirmEmail(){
    return usersCollection.deleteMany({isSendEmail: false});
  }
}
