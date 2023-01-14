import {Request, Response, Router} from 'express';
import {checkIdParams} from '../utils/checkIdParams';
import {validationBody} from '../validation/video/validationBody';
import {videoRepository} from '../repository/video.repository';

export const videosRouter = Router();

videosRouter.get('/', (req:Request, res:Response) => {
  res.send(videoRepository.getAllVideos())
});

videosRouter.get('/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  res.send(result);
});

videosRouter.post('/', (req:Request, res:Response) => {
  if(validationBody(req,res, false)) return;
  res.status(201).json(videoRepository.createVideo(req.body))
});

videosRouter.put('/:id', (req:Request, res:Response) => {
  const isHasVideo = videoRepository.getAllVideos().find(item=> item.id === +req.params.id);
  if(!isHasVideo){
    res.sendStatus(404);
    return;
  }
  if(validationBody(req,res, true)) return;
  videoRepository.updateVideo(req.body, +req.params.id);
  res.sendStatus(204);
});

videosRouter.delete('/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  videoRepository.deleteVideo(+req.params.id);
  res.status(204).json(result);
});
