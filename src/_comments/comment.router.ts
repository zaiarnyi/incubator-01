import {Router} from 'express';
import {saveUserDataFromAccessToken, validationBearer, validationCommentContent} from '../middleware/auth';
import {detectComment, validationLikeStatus, validationParamCommentId, validationParamId} from '../middleware/comments';
import {commentController} from './index';

export const commentsRouter = Router();

commentsRouter.get('/:id', saveUserDataFromAccessToken, commentController.getComments.bind(commentController));

commentsRouter.put('/:id',
  validationBearer,
  validationParamId,
  validationCommentContent,
  detectComment,
  commentController.updateCommentById.bind(commentController));

commentsRouter.put('/:commentId/like-status',
  validationBearer,
  validationLikeStatus,
  validationParamCommentId,
  commentController.changeLikeStatus.bind(commentController))

commentsRouter.delete('/:id',
  validationBearer,
  validationParamId,
  detectComment,
  commentController.deleteComment.bind(commentController));

