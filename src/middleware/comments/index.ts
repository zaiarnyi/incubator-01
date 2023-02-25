import {NextFunction, Request, Response} from 'express';
import {constants} from 'http2';
import {body, param} from 'express-validator';
import {ObjectId} from 'mongodb';
import {detectErrors} from '../../utils/helpers';
import {CommentEntity} from '../../_comments/entity/commen.entity';
import {REQUIRED_FIELD} from '../../constants';
import {LikeStatus} from '../../_comments/entity/likesStatusComments.entity';

export const detectComment = async (req:Request, res: Response, next: NextFunction) => {
  if(detectErrors(req, res)){
    return
  }
  const findUserComments = await CommentEntity.findOne({"commentatorInfo.userId": req.user!.id.toString()});
  if(!findUserComments){
    return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
  }
  const findById = await CommentEntity.findOne({_id: new ObjectId(req.params.id)});
  if(!findById){
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }
  next();
}

export const validationParamId = param('id').custom((data)=> new ObjectId(data));
export const validationLikeStatus = body('likeStatus').trim().notEmpty().bail().withMessage(REQUIRED_FIELD).isIn(Object.keys(LikeStatus))
export const validationParamCommentId = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const detectComment = await CommentEntity.findById(req.params.commentId);
    if(!detectComment){
      return res.sendStatus(404);
    }
    next();
  }catch (e) {
    return res.status(400).json({
      "errorsMessages": [
        {
          "message": "Incorrect",
          "field": "commendId"
        }
      ]
    });
  }
}
