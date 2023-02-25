import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';
import {IRegistrationDto} from '../dto/registration.dto';
import {generateCode} from '../../utils/generateConfirmCode';
import {emailService} from '../../_email/email.service';
import {usersRepository} from '../../_users/repository/users.repository';
import {addMinutes} from '../../utils/helpers';
import {usersCollection} from '../../DB';
import {ObjectId, UpdateResult} from 'mongodb';
import {UserFromJWT} from '../../types/authTypes';
import {TOKEN_EXPIRE_TIME} from '../../constants/token';
import {UserEntity} from '../../_users/Entity/user.entity';
import {UserRecoveryEntity} from '../Entity/recovery.entity';
import {detectTime} from '../../utils/time';
import {RECOVERY_STATUS} from '../interfaces/enums';
import {RefreshListEntity} from '../interfaces/refreshList.interface';

type typeTokens = { accessToken: string, refreshToken: string }
const EXPIRE_RECOVERY_TIME = 10 // minute;

export class AuthService {
  async checkUser(loginOrEmail: string, password: string): Promise<null | typeTokens> {

    try {
      const detectUser = await UserEntity.findOne().or([{login: loginOrEmail}, {email: loginOrEmail}])
      if (!detectUser) return null;
      const checkHashPassword = await bcrypt.compare(password, detectUser.hash)
      if (!checkHashPassword) return null;
      const {accessToken, refreshToken} = this.generateTokens(detectUser._id.toString());
      return {accessToken, refreshToken}
    } catch (e) {
      console.log(e,'-----')
      return null
    }
  }
  async registrationUser(body: IRegistrationDto): Promise<boolean> {
    const code = generateCode();
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = new UserEntity();
    user.email = body.email;
    user.login = body.login;
    user.hash = passwordHash;
    user.activation = {
      expireAt: addMinutes(new Date(), 60),
      code,
    };
    user.isConfirm = false;
    user.isSendEmail = false;

    await user.save();
    emailService.registrationEmail(body.email, code)
      .then(() => {
        usersRepository.setIsSendEmailRegistration(body.email, true);
      });
    return true;
  }

  async confirmUser(code: string) {
    return UserEntity.updateOne({"activation.code": code}, {isConfirm: true});
  }

  async resendConfirmCode(email: string): Promise<UpdateResult | null> {
    const code = generateCode();
    const userUpdate = await UserEntity.updateOne({email},{
      "activation.code": code,
      "activation.expireAt": addMinutes(new Date(), 60),
      isSendEmail: false,
    })
    emailService.registrationEmail(email, code)
      .then(() => {
        usersRepository.setIsSendEmailRegistration(email, true);
      });
    return userUpdate;
  }

  async changeUserTokens(refresh: string): Promise<null | typeTokens> {
    try {
      const userVerify = jwt.verify(refresh, process.env.JWT_SECRET as string) as UserFromJWT;
      const isValidRefreshToken = await this.checkRefreshTokenInList(userVerify.id, refresh);
      if (isValidRefreshToken) return null;
      const user = await UserEntity.findOne({_id: new ObjectId(userVerify.id)})
      if (!user) return null;
      const {accessToken, refreshToken} = this.generateTokens(userVerify.id.toString(), userVerify.deviceId);
      return {accessToken, refreshToken}
    } catch (e) {
      return null
    }
  }

  generateTokens(id: string, device: string = ''): typeTokens {
    let deviceId = device;
    if (!deviceId) {
      deviceId = uuidv4();
    }
    const accessToken = jwt.sign({
      id,
      deviceId
    }, process.env.JWT_SECRET as string, {expiresIn: TOKEN_EXPIRE_TIME.accessToken + 'm'})
    const refreshToken = jwt.sign({
      id,
      deviceId
    }, process.env.JWT_SECRET as string, {expiresIn: TOKEN_EXPIRE_TIME.refreshToken + 'm'})
    return {accessToken, refreshToken}
  }

  async removeUserIsNotConfirmEmail() {
    return usersCollection.deleteMany({isSendEmail: false});
  }

  async checkRefreshTokenInList(id: string, token: string) {
    return RefreshListEntity.findOne({
      $and: [
        {userId: id},
        {token_list: {$in: [token]}},
      ]
    });
  }

  async passwordRecovery(email: string): Promise<undefined> {
    try {
      const [user, recoveryUser] = await Promise.all([UserEntity.findOne({email}), UserRecoveryEntity.findOne({email})])
      if (!user) {
        return undefined;
      }

      const code = generateCode();
      if (!recoveryUser) {
        const recoveryUserCode = new UserRecoveryEntity();
        recoveryUserCode.email = user.email;
        recoveryUserCode.code = code;
        recoveryUserCode.isSendEmail = false;
        await recoveryUserCode.save();
      } else {
        await UserRecoveryEntity.updateOne({email}, {code, isSendEmail: false});
      }
      const messageId = await emailService.recoveryPassword(email, code);
      if (messageId) {
        UserRecoveryEntity.updateOne({email}, {isSendEmail: true})
      }
    } catch (e) {
    }
  }

  async createNewPassword(password: string, code: string): Promise<string | undefined> {
    try {
      const userRecovery = await UserRecoveryEntity.findOne({code});
      if (!userRecovery) {
        return RECOVERY_STATUS.incorrect;
      }
      const lastTimeUpdateCreateCode = detectTime(Date.now() - new Date(userRecovery.updatedAt).getTime());
      if (lastTimeUpdateCreateCode.m > EXPIRE_RECOVERY_TIME) {
        UserRecoveryEntity.deleteMany({code})
        return RECOVERY_STATUS.expire;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      await Promise.all([
        UserEntity.updateOne({email: userRecovery.email}, {hash: passwordHash}),
        UserRecoveryEntity.deleteMany({email: userRecovery.email}),
      ])
      return RECOVERY_STATUS.create;
    } catch (e) {
    }
  }
}
