import {body, param} from 'express-validator';
import {REGEXP_EMAIL, REGEXP_LOGIN} from '../../constants/regexp';
import {INVALID_VALUE} from '../../constants';
import {ObjectId} from 'mongodb';

export const validationUserLogin = body('login').trim().notEmpty().isLength({min: 3, max: 10}).withMessage(INVALID_VALUE).bail().custom((data)=> REGEXP_LOGIN.test(data)).withMessage(INVALID_VALUE)
export const validationUserEmail = body('email').trim().notEmpty().isEmail().withMessage(INVALID_VALUE).bail().custom((data)=> REGEXP_EMAIL.test(data)).withMessage(INVALID_VALUE)
export const validationUserPassword = body('password').isLength({min: 6, max: 20}).trim().notEmpty().withMessage(INVALID_VALUE);

//For Recovery Logic
export const validationUserNewPassword = body('newPassword').trim().isLength({min: 6, max: 20}).notEmpty().withMessage(INVALID_VALUE);
export const validationUserNewPasswordCode = body('recoveryCode').isLength({min: 7, max: 7}).trim().notEmpty().withMessage(INVALID_VALUE);

export const validationId = param('id').trim().notEmpty().custom((data)=> new ObjectId(data)).withMessage(INVALID_VALUE);
