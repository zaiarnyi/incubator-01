import {Router} from 'express';
import {validationBearer, validationCommentContent} from '../middleware/auth';
import {detectComment, validationParamId} from '../middleware/comments';
import {commentController} from './index';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentController.getComments.bind(commentController));
commentsRouter.put('/:id',
  validationBearer,
  validationParamId,
  validationCommentContent,
  detectComment,
  commentController.updateCommentById.bind(commentController));

commentsRouter.delete('/:id',
  validationBearer,
  validationParamId,
  detectComment,
  commentController.deleteComment.bind(commentController));

