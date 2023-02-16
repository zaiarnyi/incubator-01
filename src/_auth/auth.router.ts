import {Request, Response, Router} from 'express';
import {validationAuthLogin, validationBearer, validationConfirmRegistrationCode} from '../middleware/auth';
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
    return res.sendStatus(401);
  }
  res.json(authUser);
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
  const findUser = await userQueryRepository.detectUser(req.body.email);

  if(findUser){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": "email",
          "field": "user with the given email or password already exists"
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
  res.sendStatus(204);
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
  if(!userIsNotConfirm){
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
  res.sendStatus(204);
});

authRouter.post('/registration-email-resending', validationUserEmail, async (req: Request, res: Response)=> {
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
  res.sendStatus(204);
});
