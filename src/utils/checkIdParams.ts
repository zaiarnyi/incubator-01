import {Request, Response} from 'express';
import {actions} from '../repository';
import {VideoType} from '../types/video.type';

export const checkIdParams = (req: Request, res: Response): undefined | VideoType => {
  if(isNaN(+req.params.id)){
    res.sendStatus(404).send('Not valid id parameter');
    return;
  }
  const findVideo = actions.getVideo(+req.params.id);
  if(!findVideo){
    res.sendStatus(404).send('No video with this id found');
    return;
  }
  return findVideo
}
