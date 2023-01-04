import express, {Request, Response} from 'express';
import {actions} from './repository';
import {checkIdParams} from './utils/checkIdParams';
import {valueResolutions, VideoType} from './types/video.type';

const port = process.env.PORT || 3000
const parseMiddleware = express.json();

const app = express();
app.use(parseMiddleware);

app.get('/videos', (req:Request, res:Response) => {
  res.send(actions.getAllVideos())
});

app.get('/videos/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
   res.send(result);
});

app.delete('/videos/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  actions.deleteVideo(+req.params.id);
  res.send(result);
});

app.post('/videos', (req:Request, res:Response) => {
  const body: Pick<VideoType, "title" | "author" | "availableResolutions">  = req.body;
  const errors = []
  if(!body?.title?.trim()?.length){
    errors.push({field: 'title', message: "Not specified"});
  }
  if(body?.title?.trim()?.length > 40){
    errors.push({field: 'title', message: "Longer than 40 characters"});
  }
  if(!body?.author?.trim()?.length){
    errors.push({field: 'author', message: "Not specified"});
  }
  if(body?.author?.trim()?.length > 40){
    errors.push({field: 'author', message: "Longer than 40 characters"});
  }
  if(body?.availableResolutions?.length && !valueResolutions.includes(body?.availableResolutions as string)){
      errors.push({field: 'availableResolutions', message: "Not listed correctly"});
  }
  if(errors?.length){
    res.status(400).json(errors);
    return;
  }

  res.json(actions.createVideo(body))
});

app.put('/videos/:id', (req:Request, res:Response) => {
  let body: Omit<VideoType, "createdAt" | "id">  = req.body;
  const errors = [];
  if(!body?.title?.trim()?.length){
    errors.push({field: 'title', message: "Not specified"});
  }
  if(body?.title?.trim()?.length > 40){
    errors.push({field: 'title', message: "Longer than 40 characters"});
  }
  if(!body?.author?.trim()?.length){
    errors.push({field: 'author', message: "Not specified"});
  }
  if(body?.author?.trim()?.length > 40){
    errors.push({field: 'author', message: "Longer than 40 characters"});
  }

  if(body?.availableResolutions?.length && !valueResolutions.includes(body?.availableResolutions as string)){
    errors.push({field: 'availableResolutions', message: "Not listed correctly"});
  }
  if(body.minAgeRestriction && (body.minAgeRestriction < 1 || body.minAgeRestriction > 18)){
    errors.push({field: 'minAgeRestriction', message: "Not listed correctly"});
  }

  if(errors?.length){
    res.status(400).json(errors);
    return;
  }
  if(!body.hasOwnProperty('minAgeRestriction')){
    body.minAgeRestriction = null;
  }
  if(!body.hasOwnProperty('canBeDownloaded')){
    body.canBeDownloaded = false;
  }
  res.json(actions.createVideo(body))
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
