import {NextFunction, Request, Response} from 'express';
import {BASIC_LOGIN, BASIC_PASSWORD} from '../../constants/basicAuth';

export const middlewareBasicAuth = (req:Request, res: Response, next: NextFunction) => {
  if(!req.headers?.authorization?.length){
    return res.sendStatus(401)
  }
  try {
    const decodeAuth = Buffer.from(req.headers.authorization.replace(/^Basic /, ''), 'base64').toString('ascii');
    if(decodeAuth !== `${BASIC_LOGIN}:${BASIC_PASSWORD}`){
      return res.sendStatus(401);
    }
    next();
  } catch (e) {
    return res.sendStatus(401)
  }
}
