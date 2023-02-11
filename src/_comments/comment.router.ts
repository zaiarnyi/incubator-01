import {Request, Response, Router} from 'express';
import {commentQueryRepository} from './repository/query.repository';
import {validationBearer, validationCommentContent} from '../middleware/auth';
import {constants} from 'http2';
import {detectComment, validationParamId} from '../middleware/comments';
import {commentService} from './comment.service';

export const commentsRouter = Router();

commentsRouter.get('/:id', async (req:Request, res: Response) => {
  const commentById = await commentQueryRepository.getById(req.params.id);

  if(!commentById){
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }
  res.json(commentById);
});
commentsRouter.put('/:id', validationBearer,validationParamId, validationCommentContent, detectComment, async (req:Request, res: Response) => {
    await commentService.updateComment(req.body, req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});
commentsRouter.delete('/:id', validationBearer,validationParamId, detectComment, async (req:Request, res: Response) => {
    const deletedComment = await commentService.removeComments(req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});

