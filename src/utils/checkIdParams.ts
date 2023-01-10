import {Request, Response} from 'express';
import {actions} from '../repository';
import {VideoType} from '../models/VideoModel';

export const checkIdParams = (req: Request, res: Response): undefined | VideoType => {
 try {
   if(isNaN(+req.params.id)){
     res.sendStatus(404);
     return;
   }
   const findVideo = actions.getVideo(+req.params.id);
   if(!findVideo){
     res.sendStatus(404);
     return;
   }
   return findVideo
 }catch (e) {
   console.log(e)
   res.sendStatus(404);
 }
}
