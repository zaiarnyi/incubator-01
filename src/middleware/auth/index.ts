import {NextFunction, Request, Response} from 'express';
import {BASIC_LOGIN, BASIC_PASSWORD} from '../../constants/basicAuth';

export const middlewareBasicAuth = (req:Request, res: Response, next: NextFunction) => {
  if(!req.headers.authorization){
    return res.sendStatus(401)
  }
  try {
    const decodeAuth = atob(req.headers.authorization?.replace(/^Basic /, ''));
    if(decodeAuth !== `${BASIC_LOGIN}:${BASIC_PASSWORD}`){
      return res.sendStatus(401);
    }
    next();
  } catch (e) {
    console.log(e, 'middlewareBasicAuth');
  }
}
