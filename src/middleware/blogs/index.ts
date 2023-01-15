import { body, param } from "express-validator";
import {INVALID_VALUE, MAX_LENGTH_VALUE, REQUIRED_FIELD} from '../../constants';

export const validationBlogBodyName = body('name').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 15}).withMessage(MAX_LENGTH_VALUE(15));
export const validationBlogBodyDescription = body('description').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 500}).withMessage(MAX_LENGTH_VALUE(500));
export const validationBlogBodyUrl = body('websiteUrl').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isURL().withMessage(INVALID_VALUE);
export const validationBlogParamId = param('id').trim().notEmpty().isInt().withMessage(INVALID_VALUE);
