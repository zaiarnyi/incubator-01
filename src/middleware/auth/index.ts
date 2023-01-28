import {NextFunction, Request, Response} from 'express';
import {query} from 'express-validator';
import {INVALID_VALUE} from '../../constants';

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

export const validationPostParamSortBy= query('sortBy', INVALID_VALUE).trim().isEmpty().isIn(['title', 'id', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt', '']);
export const validationPostParamSortDirection = query('sortDirection', INVALID_VALUE).trim().isEmpty().isIn(['asc', 'desc', '']);
export const validationPostParamPages = query(['pageNumber', 'pageSize']).trim().isEmpty().custom((data)=> {
  if(data?.length && /\D/.test(data)){
    return false;
  }
  return true
});
