import {NextFunction, Request, Response} from 'express';
import {body, query} from 'express-validator';
import {INVALID_VALUE} from '../../constants';
import jwt from 'jsonwebtoken';
import {userQueryRepository} from '../../_users/repository/query.repository';
import {UserFromJWT} from '../../types/authTypes';
import {UserModel} from '../../_users/Model/user.model';

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

export const validationBearer = async (req: Request, res: Response, next: NextFunction)=> {
  if(!req.headers.authorization?.length || !/^Bearer/.test(req.headers.authorization)){
    return res.sendStatus(401);
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const getUserId = jwt.verify(token, process.env.JWT_SECRET as string) as UserFromJWT;
    const userData = await userQueryRepository.getUserById(getUserId.id);
    if(!userData || !userData.isCreated){
      return res.sendStatus(401);
    }
    req.user = userData
    next();
  }catch (e) {
    console.log(e)
    return res.sendStatus(401);
  }
}


export const validationAuthLogin = body(['loginOrEmail', 'password']).trim().notEmpty().withMessage(INVALID_VALUE);

export const validationPostParamSortBy= query('sortBy').trim().optional().isIn(['title', 'id', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt']).withMessage(INVALID_VALUE);
export const validationPostParamSortDirection = query('sortDirection').trim().optional().isIn(['asc', 'desc', '-1', '1']).withMessage(INVALID_VALUE);
export const validationPostParamPages = query(['pageNumber', 'pageSize']).trim().optional().custom((data)=> {
  if(data?.length && /\D/.test(data)){
    return false;
  }
  return true
});

export const validationCommentContent = body('content').trim().isLength({min: 20, max: 300}).notEmpty().withMessage(INVALID_VALUE);
