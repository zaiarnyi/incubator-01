import bcrypt from 'bcrypt';
import {userQueryRepository} from '../../_users/repository/query.repository';
import jwt from 'jsonwebtoken';
import {IRegistrationDto} from '../dto/registration.dto';
import {generateCode} from '../../utils/generateConfirmCode';
import {emailService} from '../../_email/email.service';
import {usersRepository} from '../../_users/repository/users.repository';
import {InsertOneResult} from 'mongodb';
import {ICreateUser} from '../../_users/interfaces/createUser.interface';
import {UserModel} from '../../_users/Model/user.model';

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
    const isSendEmail = emailService.registrationEmail(body.email, code);

    if(!isSendEmail) return null;
    const user = {
      email: body.email,
      login: body.login,
      hash: passwordHash,
      activationCode: code,
      isConfirm: false,
      createdAt: new Date().toISOString(),
    }
    const createdUser = await usersRepository.createUser({...user});
    return !!createdUser.insertedId;
  }
}
