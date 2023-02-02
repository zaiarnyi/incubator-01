import {body, param} from 'express-validator';
import {REGEXP_EMAIL, REGEXP_LOGIN} from '../../constants/regexp';
import {INVALID_VALUE} from '../../constants';
import {ObjectId} from 'mongodb';

export const validationUserLogin = body('login').trim().notEmpty().isLength({min: 3, max: 10}).withMessage(INVALID_VALUE).bail().custom((data)=> REGEXP_LOGIN.test(data)).withMessage(INVALID_VALUE)
export const validationUserEmail = body('email').trim().notEmpty().isEmail().withMessage(INVALID_VALUE).bail().custom((data)=> REGEXP_EMAIL.test(data)).withMessage(INVALID_VALUE)
export const validationUserPassword = body('password').trim().notEmpty().withMessage(INVALID_VALUE);

export const validationId = param('id').trim().notEmpty().custom((data)=> new ObjectId(data)).withMessage(INVALID_VALUE);
