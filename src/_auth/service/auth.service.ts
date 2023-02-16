import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';
import {IRegistrationDto} from '../dto/registration.dto';
import {generateCode} from '../../utils/generateConfirmCode';
import {emailService} from '../../_email/email.service';
import {usersRepository} from '../../_users/repository/users.repository';
import {addMinutes} from '../../utils/helpers';
import {usersCollection} from '../../DB';

class UpdateResult {
}

export const authService = {
  async checkUser(loginOrEmail: string, password: string): Promise<boolean | {accessToken: string}>{
   try {
     const detectUser = await userQueryRepository.detectUser(loginOrEmail);
     if(!detectUser) return false;
     const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
     if(!checkHashPassword) return false;
     const accessToken = jwt.sign({id: detectUser.id.toString()}, process.env.JWT_SECRET as string, {expiresIn: '30d'})
     return {accessToken}
   }catch (e) {
     console.log(e)
     return false
   }
  },
  async registrationUser(body: IRegistrationDto): Promise<null | boolean>{
    const code = generateCode();
    const passwordHash = await bcrypt.hash(body.password, 10);
    const isSendEmail = await emailService.registrationEmail(body.email, code);

    if(!isSendEmail) return null;
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
    }
    const createdUser = await usersRepository.createUser({...user});
    return !!createdUser.insertedId;
  },
  async confirmUser(code: string){
    return usersCollection.updateOne({"activation.code": code}, {$set: {isConfirm: true}});
  },
  async resendConfirmCode(email: string): Promise<UpdateResult | null>{
    const code = generateCode();
    const isSendEmail = await emailService.registrationEmail(email, code);
    if(!isSendEmail) return null;
    return usersCollection.updateOne({email}, {$set: {"activation.code": code, "activation.expireAt": addMinutes(new Date(), 60).getTime()}})
  }
}
