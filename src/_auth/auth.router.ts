import {Request, Response, Router} from 'express';
import {validationAuthLogin, validationBearer} from '../middleware/auth';
import {detectErrors} from '../utils/helpers';
import {authService} from './service/auth.service';
import {UserModel} from '../_users/Model/user.model';

export const authRouter = Router();

authRouter.post('/login', validationAuthLogin,  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return
  }
  const authUser = await authService.checkUser(req.body.loginOrEmail, req.body.password);
  if(typeof authUser !== 'boolean' && authUser?.status === 'not found'){
    return res.status(401).json(authUser);
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
