import {Request, Response, Router} from 'express';
import {validationAuthLogin, validationBearer} from '../middleware/auth';
import {detectErrors} from '../utils/helpers';
import {authService} from './service/auth.service';
import {UserModel} from '../_users/Model/user.model';
import {validationUserEmail, validationUserLogin, validationUserPassword} from '../middleware/users';
import {userQueryRepository} from '../_users/repository/query.repository';
import {constants} from 'http2';

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
    console.log(findUser, 'findUserfindUserfindUser')
  if(findUser){
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      "errorsMessages": [
        {
          "message": "email or password",
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
