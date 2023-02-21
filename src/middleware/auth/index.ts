import {NextFunction, Request, Response} from 'express';
import {body, param, query} from 'express-validator';
import {INVALID_VALUE} from '../../constants';
import jwt from 'jsonwebtoken';
import {userQueryRepository} from '../../_users/repository/query.repository';
import {UserFromJWT} from '../../types/authTypes';
import {constants} from 'http2';
import {authService} from '../../_auth/service/auth.service';

export const middlewareBasicAuth = (req:Request, res: Response, next: NextFunction) => {
  if(!req.headers?.authorization?.length){
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
  }
  try {
    const decodeAuth = Buffer.from(req.headers.authorization.replace(/^Basic /, ''), 'base64').toString('ascii');
    if(decodeAuth !== `${process.env.BASIC_LOGIN}:${process.env.BASIC_PASSWORD}`){
      return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
    next();
  } catch (e) {
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
  }
}

export const validationBearer = async (req: Request, res: Response, next: NextFunction)=> {
  if(!req.headers.authorization?.length || !/^Bearer/.test(req.headers.authorization)){
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const getUserId = jwt.verify(token, process.env.JWT_SECRET as string) as UserFromJWT;
    const userData = await userQueryRepository.getUserById(getUserId.id);
    if(!userData || !userData.isConfirm){
      return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
    req.user = userData
    next();
  }catch (e) {
    console.log(e)
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
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
export const validationConfirmRegistrationCode = body('code')
  .trim()
  .isLength({min: 7, max: 7})
  .notEmpty()
  .bail()
  .withMessage(INVALID_VALUE)
  .custom(code=> /[A-Z\d]{3}-[A-Z\d]{3}/.test(code)).withMessage(INVALID_VALUE)
export const validationSecurityDeviceId = param('deviceId').trim().notEmpty().withMessage(INVALID_VALUE)

const detectRefreshToken = (req: Request, res: Response)=> {
  if(req.cookies && (!req.headers?.cookie || !req.headers?.cookie?.includes('refreshToken'))){
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
  let refreshToken = ''
  const cookies = req.cookies || req.headers?.cookie;
  const findRefreshHeader = cookies.split(';').find( (item: string) => /^refreshToken/.test(item.trim()));
  if(findRefreshHeader){
    refreshToken = findRefreshHeader.split('refreshToken=')[1];
  }
  if(!refreshToken) return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  return refreshToken;
}

export const detectRefreshTokenFromCookie = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    req.body = {
      ...(req.body || {}),
      refreshToken: detectRefreshToken(req, res),
    }
    next();
  }catch (e) {
    res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
}

export const validationRefreshToken = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const refreshToken = detectRefreshToken(req, res) as string;
    const userVerify = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as UserFromJWT;
    const user = await userQueryRepository.getUserById(userVerify.id);
    if(!user){
      return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
    // TODO
    // const findTokenFromBlackList = await authService.checkRefreshTokenInList(userVerify.id, refreshToken);
    // if(findTokenFromBlackList){
    //   return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    // }
    req.body = {
      ...(req.body || {}),
      refreshToken: detectRefreshToken(req, res),
      userId: userVerify.id,
      deviceId: userVerify.deviceId || undefined,
    }
    next();
  }catch (e) {
    console.log(e, 'findTokenFromBlackList')
    return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
  }
}
