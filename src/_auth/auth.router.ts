import {Request, Response, Router} from 'express';
import cron from 'node-cron';
import {
  detectRefreshTokenFromCookie,
  validationAuthLogin,
  validationBearer,
  validationConfirmRegistrationCode, validationRefreshToken
} from '../middleware/auth';
import {detectErrors} from '../utils/helpers';
import {authService} from './service/auth.service';
import {UserModel} from '../_users/Model/user.model';
import {validationUserEmail, validationUserLogin, validationUserPassword} from '../middleware/users';
import {userQueryRepository} from '../_users/repository/query.repository';
import {constants} from 'http2';
import {CONFIRM_CODE_EXPIRED} from '../constants';

export const authRouter = Router();

authRouter.post('/login', validationAuthLogin,  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return
  }
  const authUser = await authService.checkUser(req.body.loginOrEmail, req.body.password);
  if(!authUser){
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
  res
    .cookie('refreshToken', authUser.refreshToken, { httpOnly: true, secure: true})
    .json({accessToken: authUser.accessToken});
});

authRouter.get('/me', validationBearer, async (req: Request, res: Response)=> {
  const {email, id, login} = req.user as UserModel;
  const user = {
    email: email,
    login: login,
    userId: id.toString(),
  }
  res.json(user);
})

authRouter.post('/registration',
  validationUserLogin,
  validationUserEmail,
  validationUserPassword,
  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return
  }
  const findUserByEmailAndLogin = await userQueryRepository.detectUserByEmailAndLogin(req.body.email, req.body.login);

  if(findUserByEmailAndLogin?.login === req.body.login){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": "user with the given login already exists",
          "field": "login"
        }
      ]
    })
  }
  if(findUserByEmailAndLogin?.email === req.body.email){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": "user with the given email already exists",
          "field": "email"
        }
      ]
    })
  }
  const isCreatedUser = await authService.registrationUser(req.body);
  if(!isCreatedUser){
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
});

authRouter.post('/registration-confirmation', validationConfirmRegistrationCode, async (req:Request, res: Response)=> {
  if(detectErrors(req, res)){
    return null;
  }
  const findUser = await userQueryRepository.detectUser(req.body.email);

  if(findUser && findUser.isConfirm){
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
  if(!userIsNotConfirm || userIsNotConfirm.isConfirm){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": CONFIRM_CODE_EXPIRED,
          "field": "code"
        }
      ]
    })
  }
  await authService.confirmUser(req.body.code);
  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});

authRouter.post('/registration-email-resending', validationUserEmail, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return null;
  }
  const findUser = await userQueryRepository.detectUser(req.body.email);

  if(!findUser || findUser.isConfirm){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": !findUser ? "User Not Found" : "user with the given email or password already exists",
          "field": "email",
        }
      ]
    })
  }
  const isSendAndUpdateCode = await authService.resendConfirmCode(req.body.email)
  if(!isSendAndUpdateCode){
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
});

authRouter.post('/refresh-token', detectRefreshTokenFromCookie, async (req: Request, res: Response)=> {
  const changeTokens = await authService.changeUserTokens(req.body.refreshToken);
  if(!changeTokens){
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
  res
    .status(constants.HTTP_STATUS_OK)
    .cookie('refreshToken', changeTokens.refreshToken, { httpOnly: true, secure: true})
    .json({accessToken: changeTokens.accessToken});
});

authRouter.post('/logout', validationRefreshToken, async (req: Request, res: Response)=> {
  const { userId, refreshToken } = req.body;
  await authService.addRefreshTokenToList(userId, refreshToken);
  res
    .clearCookie('refreshToken')
    .sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});

// cron.schedule('0 0 * * *', () => {
//   authService.removeUserIsNotConfirmEmail();
// });


