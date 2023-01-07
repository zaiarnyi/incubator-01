import {Request, Response} from 'express';
import {actions} from '../repository';
import {VideoType} from '../models/VideoModel';

export const checkIdParams = (req: Request, res: Response): undefined | VideoType => {
  if(isNaN(+req.params.id)){
    res.send(404);
    return;
  }
  const findVideo = actions.getVideo(+req.params.id);
  if(!findVideo){
    res.send(404);
    return;
  }
  return findVideo
}
