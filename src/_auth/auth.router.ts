import {Request, Response, Router} from 'express';
import {authService} from './service/auth.service';
import {validationAuthLogin} from '../middleware/auth';
import {validationResult} from 'express-validator';

export const authRouter = Router();

authRouter.post('/login', validationAuthLogin,  async (req: Request, res: Response)=> {
  const errors = validationResult(req);
  const errorObject = {
    "errorsMessages": [
      {
        "message": "password or login is wrong",
        "field": "auth"
      }
    ]
  }
  if (!errors.isEmpty()) {
    res.status(400).json(errorObject);
    return true
  }
  const resultCheckUser = await authService.checkUser(req.body.loginOrEmail, req.body.password);
  if(!resultCheckUser){
    return res.status(401).json(errorObject)
  }
  res.sendStatus(204);
})
