import { body, param } from "express-validator";

export const validationBlogBodyName = body('name').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isLength({max: 15}).withMessage('Maximum number of characters 15');
export const validationBlogBodyDescription = body('description').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isLength({max: 500}).withMessage('Maximum number of characters 500');
export const validationBlogBodyUrl = body('websiteUrl').exists().withMessage('Required field').bail().trim().notEmpty().withMessage('Required field').bail().isURL().withMessage('Not valid link');
export const validationBlogParamId = param('id').trim().notEmpty().isInt().withMessage('Invalid id value');
