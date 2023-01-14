import {body} from 'express-validator';

export const validationPostBodyTitle = body('title').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isLength({max: 30}).withMessage('Maximum number of characters 30');
export const validationPostBodyDescription = body('shortDescription').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isLength({max: 100}).withMessage('Maximum number of characters 100');
export const validationPostBodyContent = body('content').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isLength({max: 1000}).withMessage('Maximum number of characters 1000');
export const validationPostBodyBlogId = body('blogId').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field');
