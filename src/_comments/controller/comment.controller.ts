import {Request, Response} from 'express';
import {CommentQueryRepository} from '../repository/query.repository';
import {constants} from 'http2';
import {CommentService} from '../comment.service';

export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentQueryRepository: CommentQueryRepository) {}
  async getComments(req: Request, res: Response) {
    const commentById = await this.commentQueryRepository.getById(req.params.id);

    if (!commentById) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }
    res.json(commentById);
  }

  async updateCommentById(req: Request, res: Response) {
    await this.commentService.updateComment(req.body, req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);

  }

  async deleteComment(req: Request, res: Response) {
    await this.commentService.removeComments(req.params.id);
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }
}
