import {Request, Response, Router} from 'express';
import {validationAuthLogin, validationBearer} from '../middleware/auth';
import {detectErrors} from '../utils/helpers';
import {authService} from './service/auth.service';

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
  // @ts-ignore
  const {email, id, login} = res.user;
  const user = {
    email: email,
    login: login,
    userId: id.toString(),
  }
  res.json(user);
})
