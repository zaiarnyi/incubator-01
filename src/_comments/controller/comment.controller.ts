import {Request, Response} from 'express';
import {CommentQueryRepository} from '../repository/query.repository';
import {constants} from 'http2';
import {CommentService} from '../comment.service';
import {detectErrors} from '../../utils/helpers';

export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentQueryRepository: CommentQueryRepository) {}
  async getComments(req: Request, res: Response) {
    let userId = req.user?.id?.toString() || '';
    const [commentById, likesInfo] = await Promise.all([
      this.commentQueryRepository.getById(req.params.id),
      this.commentService.getStatisticsLikeStatus(req.params.id, userId)]);

    if (!commentById) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }
    res.json({
      ...commentById,
      likesInfo
    });
  }

  async updateCommentById(req: Request, res: Response) {
    await this.commentService.updateComment(req.body, req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);

  }

  async deleteComment(req: Request, res: Response) {
    await this.commentService.removeComments(req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async changeLikeStatus(req: Request, res: Response){
    if(detectErrors(req,res)){
      return null;
    }
    const result = await this.commentService.setLikeStatus(req.user!.id.toString(), req.body.likeStatus, req.params.commentId);
    if(result === null){
      res.sendStatus(404);
    }
    res.sendStatus(204);
  }
}
