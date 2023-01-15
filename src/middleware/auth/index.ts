import {NextFunction, Request, Response} from 'express';

export const middlewareBasicAuth = (req:Request, res: Response, next: NextFunction) => {
  if(!req.headers?.authorization?.length){
    return res.sendStatus(401)
  }
  try {
    const decodeAuth = Buffer.from(req.headers.authorization.replace(/^Basic /, ''), 'base64').toString('ascii');
    if(decodeAuth !== `${process.env.BASIC_LOGIN}:${process.env.BASIC_PASSWORD}`){
      return res.sendStatus(401);
    }
    next();
  } catch (e) {
    return res.sendStatus(401)
  }
}
