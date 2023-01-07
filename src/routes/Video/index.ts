import {Request, Response, Router} from 'express';
import {actions} from '../../repository';
import {checkIdParams} from '../../utils/checkIdParams';
import {validationBody} from '../../utils/validationBody';

export const videosRouter = Router();

videosRouter.get('/', (req:Request, res:Response) => {
  res.send(actions.getAllVideos())
});

videosRouter.get('/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  res.send(result);
});

videosRouter.delete('/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  actions.deleteVideo(+req.params.id);
  res.send(result);
});

videosRouter.post('/', (req:Request, res:Response) => {
  if(validationBody(req,res, false)) return;
  res.json(JSON.stringify(actions.createVideo(req.body)))
});

videosRouter.put('/:id', (req:Request, res:Response) => {
  const isHasVideo = actions.getAllVideos().find(item=> item.id === +req.params.id);
  if(!isHasVideo){
    res.send(404);
    return;
  }
  if(validationBody(req,res, true)) return;
  actions.updateVideo(req.body, +req.params.id);
  res.send(204);
});
