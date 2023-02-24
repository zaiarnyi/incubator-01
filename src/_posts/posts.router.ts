import {Router} from 'express';
import {validationBlogParamId} from '../middleware/blogs';
import {schemaPost} from '../middleware/posts';
import {checkSchema} from 'express-validator';
import {
  middlewareBasicAuth,
  validationBearer,
  validationCommentContent,
  validationPostParamPages,
  validationPostParamSortBy,
  validationPostParamSortDirection
} from '../middleware/auth';
import {postController} from './index';


export const postsRouter = Router();

postsRouter.get('/',
  validationPostParamSortBy,
  validationPostParamSortDirection,
  validationPostParamPages,
  postController.getPosts.bind(postController));

postsRouter.get('/:id',  postController.getPostById.bind(postController));

postsRouter.post('/',
  middlewareBasicAuth,
  checkSchema(schemaPost(false)),
  postController.createPost.bind(postController));

postsRouter.get('/:postId/comments',
  validationPostParamSortBy,
  validationPostParamPages,
  postController.getCommentsByIdPost.bind(postController));


postsRouter.post('/:postId/comments',
  validationBearer,
  validationCommentContent,
  postController.createCommentByIdPost.bind(postController));

postsRouter.put('/:id',
  middlewareBasicAuth,
  checkSchema(schemaPost(true)),
  postController.updatePostById.bind(postController));

postsRouter.delete('/:id',
  middlewareBasicAuth,
  validationBlogParamId,
  postController.deletePostById.bind(postController))
