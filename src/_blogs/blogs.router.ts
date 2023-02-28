import {Router} from 'express';
import {
  validationBlogBodyContent,
  validationBlogBodyDescription,
  validationBlogBodyName,
  validationBlogBodyShortDescription,
  validationBlogBodyTitle,
  validationBlogBodyUrl,
  validationBlogParamId,
  validationBlogParamPages,
  validationBlogParamSortBy,
  validationBlogParamSortDirection,
  validationPostWithBlogIdParamSortBy
} from '../middleware/blogs';
import {middlewareBasicAuth, saveUserDataFromAccessToken} from '../middleware/auth';
import {blogsController} from './index';


export const blogsRouter = Router();

blogsRouter.get('/',
  validationBlogParamSortBy,
  validationBlogParamSortDirection,
  validationBlogParamPages,
  blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController));

blogsRouter.get('/:id/posts',
  validationBlogParamId,
  validationPostWithBlogIdParamSortBy,
  validationBlogParamSortDirection,
  validationBlogParamPages,
  saveUserDataFromAccessToken,
  blogsController.getPostByBlogId.bind(blogsController))

blogsRouter.post('/',
  middlewareBasicAuth,
  validationBlogBodyName,
  validationBlogBodyDescription,
  validationBlogBodyUrl,
  blogsController.createBlog.bind(blogsController));

blogsRouter.post('/:id/posts',
  middlewareBasicAuth,
  validationBlogParamId,
  validationBlogBodyTitle,
  validationBlogBodyShortDescription,
  validationBlogBodyContent,
  blogsController.createPostByBlogId.bind(blogsController))

blogsRouter.put('/:id',
  middlewareBasicAuth,
  validationBlogParamId,
  validationBlogBodyName,
  validationBlogBodyDescription,
  validationBlogBodyUrl,
  blogsController.updateBlogById.bind(blogsController));

blogsRouter.delete('/:id',
  middlewareBasicAuth,
  validationBlogParamId,
  blogsController.deleteById.bind(blogsController))
