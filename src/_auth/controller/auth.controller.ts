import {Request, Response} from 'express';
import {detectErrors} from '../../utils/helpers';
import {AuthService} from '../service/auth.service';
import {constants} from 'http2';
import {securityRepository} from '../../_security/repositories/security.repository';
import {UserEntity} from '../../_users/Entity/user.entity';
import {userQueryRepository} from '../../_users/repository/query.repository';
import {CONFIRM_CODE_EXPIRED} from '../../constants';
import {RECOVERY_STATUS} from '../interfaces/enums';

const HTTPS_ONLY_COOKIES = true;
const SECURITY_COOKIE = true;

export class AuthController {
  constructor(private readonly authService: AuthService) {}


  async login(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const authUser = await this.authService.checkUser(req.body.loginOrEmail, req.body.password);
    if (!authUser) {
      return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
    await securityRepository.saveDevice(req.headers['user-agent'] as string, req.ip, authUser.refreshToken);
    res
      .cookie('refreshToken', authUser.refreshToken, {httpOnly: HTTPS_ONLY_COOKIES, secure: SECURITY_COOKIE})
      .json({accessToken: authUser.accessToken});
  }

  async me(req: Request, res: Response) {
    const {email, id, login} = req.user as UserEntity;
    const user = {
      email: email,
      login: login,
      userId: id.toString(),
    }
    res.json(user);
  }

  async registration(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const findUserByEmailAndLogin = await userQueryRepository.detectUserByEmailAndLogin(req.body.email, req.body.login);

    if (findUserByEmailAndLogin?.login === req.body.login) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": "user with the given login already exists",
            "field": "login"
          }
        ]
      })
    }
    if (findUserByEmailAndLogin?.email === req.body.email) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": "user with the given email already exists",
            "field": "email"
          }
        ]
      })
    }
    const isCreatedUser = await this.authService.registrationUser(req.body);
    if (!isCreatedUser) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": "An error occurred while sending",
            "field": "email"
          }
        ]
      })
    }
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async confirmRegistration(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const findUser = await userQueryRepository.detectUser(req.body.email);

    if (findUser && findUser.isConfirm) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": "email",
            "field": "user with the given email or password already exists"
          }
        ]
      })
    }
    const userIsNotConfirm = await userQueryRepository.getUserByCode(req.body.code);
    if (!userIsNotConfirm || userIsNotConfirm.isConfirm) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": CONFIRM_CODE_EXPIRED,
            "field": "code"
          }
        ]
      })
    }
    await this.authService.confirmUser(req.body.code);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async resendEmailForRegistration(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const findUser = await userQueryRepository.detectUser(req.body.email);

    if (!findUser || findUser.isConfirm) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": !findUser ? "User Not Found" : "user with the given email or password already exists",
            "field": "email",
          }
        ]
      })
    }
    const isSendAndUpdateCode = await this.authService.resendConfirmCode(req.body.email)
    if (!isSendAndUpdateCode) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        "errorsMessages": [
          {
            "message": "An error occurred while sending",
            "field": "email"
          }
        ]
      })
    }
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async refreshToken(req: Request, res: Response) {
    const changeTokens = await this.authService.changeUserTokens(req.body.refreshToken);
    if (!changeTokens) {
      return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
    await securityRepository.saveDevice(req.headers['user-agent'] as string, req.ip, changeTokens.refreshToken);
    res
      .status(constants.HTTP_STATUS_OK)
      .cookie('refreshToken', changeTokens.refreshToken, {httpOnly: HTTPS_ONLY_COOKIES, secure: SECURITY_COOKIE})
      .json({accessToken: changeTokens.accessToken});
  }

  async logout(req: Request, res: Response) {
    const {userId, deviceId} = req.body;
    await securityRepository.deleteSessionUser(deviceId, userId);
    res
      .clearCookie('refreshToken')
      .sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async recoveryPassword(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    await this.authService.passwordRecovery(req.body.email);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async createNewPassword(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const result = await this.authService.createNewPassword(req.body.newPassword, req.body.recoveryCode);
    if (result === RECOVERY_STATUS.incorrect) {
      return res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
    } else if (result === RECOVERY_STATUS.expire) {
      return res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
    }
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }
}
