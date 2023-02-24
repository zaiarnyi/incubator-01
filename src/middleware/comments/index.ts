import {NextFunction, Request, Response} from 'express';
import {constants} from 'http2';
import {param} from 'express-validator';
import {ObjectId} from 'mongodb';
import {detectErrors} from '../../utils/helpers';
import {CommentEntity} from '../../_comments/entity/commen.entity';

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
