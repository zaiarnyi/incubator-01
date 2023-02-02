import {Request, Response, Router} from 'express';
import {middlewareBasicAuth, validationAuthLogin} from '../middleware/auth';
import {detectErrors} from '../utils/helpers';
import {authService} from './service/auth.service';

export const authRouter = Router();

authRouter.post('/login', validationAuthLogin,  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return
  }
  const authUser = await authService.checkUser(req.body.loginOrEmail, req.body.password);
  if(!authUser){
    res.sendStatus(401)
  }
  res.sendStatus(204);
})
