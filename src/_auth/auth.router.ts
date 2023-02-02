import {Request, Response, Router} from 'express';
import {authService} from './service/auth.service';
import {middlewareBasicAuth, validationAuthLogin} from '../middleware/auth';
import {validationResult} from 'express-validator';
import {detectErrors} from '../utils/helpers';

export const authRouter = Router();

authRouter.post('/login',middlewareBasicAuth, validationAuthLogin,  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return
  }
  res.sendStatus(204);
})
