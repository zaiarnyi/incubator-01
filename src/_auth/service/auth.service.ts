import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
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
import {TOKEN_EXPIRE_TIME} from '../../constants/token';

type typeTokens = {accessToken: string, refreshToken: string}

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<null | typeTokens>{
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
    emailService.registrationEmail(body.email, code)
      .then(()=> {
        usersRepository.setIsSendEmailRegistration(body.email, true);
      });
    return !!createdUser.insertedId;
  },
  async confirmUser(code: string){
    return usersCollection.updateOne({"activation.code": code}, {$set: {isConfirm: true}});
  },
  async resendConfirmCode(email: string): Promise<UpdateResult | null>{
    const code = generateCode();
    const userUpdate = await usersCollection.updateOne({email}, {$set:
        {
          "activation.code": code,
          "activation.expireAt": addMinutes(new Date(), 60).getTime(),
          isSendEmail: false,
        }
    })
    emailService.registrationEmail(email, code)
      .then(()=> {
        usersRepository.setIsSendEmailRegistration(email, true);
      });
    return userUpdate;
  },
  async changeUserTokens(refresh: string): Promise<null | typeTokens>{
   try {
     const userVerify = jwt.verify(refresh, process.env.JWT_SECRET as string) as UserFromJWT;
     const isValidRefreshToken = await authService.checkRefreshTokenInList(userVerify.id, refresh);
     if(isValidRefreshToken) return null;
     const user = await userQueryRepository.getUserById(userVerify.id);
     if(!user) return null;
     const {accessToken, refreshToken} = this.generateTokens(userVerify.id.toString(), userVerify.deviceId);
     return {accessToken, refreshToken}
   }catch (e) {
     return null
   }
  },
  generateTokens(id: string, device: string = ''): typeTokens{
    let deviceId = device;
    if(!deviceId){
      deviceId = uuidv4();
    }
    const accessToken = jwt.sign({id, deviceId}, process.env.JWT_SECRET as string, {expiresIn: TOKEN_EXPIRE_TIME.accessToken + 's'})
    const refreshToken = jwt.sign({id, deviceId}, process.env.JWT_SECRET as string, {expiresIn: TOKEN_EXPIRE_TIME.refreshToken + 's'})
    return {accessToken, refreshToken}
  },
  async removeUserIsNotConfirmEmail(){
    return usersCollection.deleteMany({isSendEmail: false});
  },
  async checkRefreshTokenInList (id: string, token: string) {
    return refreshTokenListCollection.findOne({$and: [
        {userId: id},
        {token_list: {$in: [token]}},
      ]});
  }
}
