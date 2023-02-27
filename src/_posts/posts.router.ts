import {Router} from 'express';
import {validationBlogParamId} from '../middleware/blogs';
import {schemaPost} from '../middleware/posts';
import {checkSchema} from 'express-validator';
import {
  middlewareBasicAuth, saveUserDataFromAccessToken,
  validationBearer,
  validationCommentContent, validationPostIdParams,
  validationPostParamPages,
  validationPostParamSortBy,
  validationPostParamSortDirection
} from '../middleware/auth';
import {postController} from './index';
import {validationLikeStatus} from '../middleware/comments';


export const postsRouter = Router();

postsRouter.get('/',
  validationPostParamSortBy,
  validationPostParamSortDirection,
  validationPostParamPages,
  saveUserDataFromAccessToken,
  postController.getPosts.bind(postController));

postsRouter.get('/:id', saveUserDataFromAccessToken, postController.getPostById.bind(postController));

postsRouter.post('/',
  middlewareBasicAuth,
  saveUserDataFromAccessToken,
  checkSchema(schemaPost(false)),
  postController.createPost.bind(postController));

postsRouter.get('/:postId/comments',
  validationPostParamSortBy,
  validationPostParamPages,
  saveUserDataFromAccessToken,
  postController.getCommentsByIdPost.bind(postController));

postsRouter.post('/:postId/comments',
  validationPostIdParams,
  validationBearer,
  validationCommentContent,
  postController.createCommentByIdPost.bind(postController));

postsRouter.put('/:postId/like-status',
  validationPostIdParams,
  validationLikeStatus,
  validationBearer,
  postController.updateLikeStatusForCommentByPost.bind(postController))

postsRouter.put('/:id',
  validationBearer,
  checkSchema(schemaPost(true)),
  postController.updatePostById.bind(postController));

postsRouter.delete('/:id',
  middlewareBasicAuth,
  validationBlogParamId,
  postController.deletePostById.bind(postController))
