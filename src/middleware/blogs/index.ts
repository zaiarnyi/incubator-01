import {body, param, query} from "express-validator";
import {INVALID_VALUE, MAX_LENGTH_VALUE, REQUIRED_FIELD} from '../../constants';
import {ObjectId} from 'mongodb';
import {queryBlogsRepository} from '../../_blogs/repository/query.repository';

export const validationBlogBodyName = body('name').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 15}).withMessage(MAX_LENGTH_VALUE(15));
export const validationBlogBodyDescription = body('description').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 500}).withMessage(MAX_LENGTH_VALUE(500));
export const validationBlogBodyUrl = body('websiteUrl').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isURL().withMessage(INVALID_VALUE);
export const validationBlogParamId = param('id').trim().notEmpty().withMessage(INVALID_VALUE).customSanitizer(value => new ObjectId(value));
export const validationBlogParamSortBy= query('sortBy', INVALID_VALUE).trim().isEmpty().isIn(['createdAt', 'id', 'name', 'description', 'websiteUrl', '']);
export const validationBlogParamSortDirection = query('sortDirection', INVALID_VALUE).trim().isEmpty().isIn(['asc', 'desc', '']);
export const validationBlogParamPages = query(['pageNumber', 'pageSize']).trim().isEmpty().custom((data)=> {
  if(data?.length && /\D/.test(data)){
    return false;
  }
  return true
}).bail();
export const validationLengthPostsFromBlog = param('id').trim().bail();


// Create Post for BlogId
export const validationBlogBodyTitle = body('title').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 30}).withMessage(MAX_LENGTH_VALUE(30));
export const validationBlogBodyShortDescription = body('shortDescription').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 100}).withMessage(MAX_LENGTH_VALUE(100));
export const validationBlogBodyContent = body('content').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 1000}).withMessage(MAX_LENGTH_VALUE(1000));
