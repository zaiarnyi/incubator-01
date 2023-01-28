import {body, param, query} from "express-validator";
import {INVALID_VALUE, MAX_LENGTH_VALUE, REQUIRED_FIELD} from '../../constants';
import {ObjectId} from 'mongodb';

export const validationBlogBodyName = body('name').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 15}).withMessage(MAX_LENGTH_VALUE(15));
export const validationBlogBodyDescription = body('description').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 500}).withMessage(MAX_LENGTH_VALUE(500));
export const validationBlogBodyUrl = body('websiteUrl').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isURL().withMessage(INVALID_VALUE);
export const validationBlogParamId = param('id').trim().notEmpty().withMessage(INVALID_VALUE);
export const validationBlogParamSortBy= query('sortBy').trim().isIn(['createdAt', 'id', 'title', 'blogName', 'blogId', 'content', '']).withMessage(INVALID_VALUE);
export const validationBlogParamSortDirection = query('sortDirection').trim().isIn(['asc', 'desc', '1', '-1', '']).withMessage(INVALID_VALUE);
export const validationBlogParamPages = query(['pageNumber', 'pageSize']).trim().custom((data)=> {
  if(data?.length && /\D/.test(data)){
    return false;
  }
  return true
});
// export const validationLengthPostsFromBlog = param('id').trim().custom(async (data)=> {
//   const result = await queryBlogsRepository.getBlogById(data)
//    if(!result){
//      throw new Error(NOT_FOUND_BLOG_ID)
//    }
//   return true
// })


// Create Post for BlogId
export const validationBlogBodyTitle = body('title').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 30}).withMessage(MAX_LENGTH_VALUE(30));
export const validationBlogBodyShortDescription = body('shortDescription').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 100}).withMessage(MAX_LENGTH_VALUE(100));
export const validationBlogBodyContent = body('content').exists().withMessage(REQUIRED_FIELD).bail().trim().notEmpty().withMessage(REQUIRED_FIELD).bail().isLength({max: 1000}).withMessage(MAX_LENGTH_VALUE(1000));
