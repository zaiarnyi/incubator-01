import express, {Request, Response} from 'express';
import {videosRouter} from './routes/Video';
import {actions} from './repository';
import {checkIdParams} from './utils/checkIdParams';
import {validationBody} from './utils/validationBody';

const port = process.env.PORT || 3000
const parseMiddleware = express.json();

export const app = express();
app.use(parseMiddleware);
// app.use('/videos', videosRouter);

app.delete('/testing/all-data', (req: Request, res:Response) => {
  actions.deleteAll();
  res.send(204);
})

app.get('/', (req, res) => {
  res.send(new Date())
})

app.get('/videos', (req:Request, res:Response) => {
  res.send(actions.getAllVideos())
});

app.get('/videos/:id', (req:Request, res:Response) => {
  const result = checkIdParams(req, res);
  if(!result) return undefined;
  res.send(result);
});

app.post('/videos', (req:Request, res:Response) => {
  if(validationBody(req,res, false)) return;
  res.json(actions.createVideo(req.body))
});

app.put('/videos/:id', (req:Request, res:Response) => {
  try {
    const isHasVideo = actions.getAllVideos().find(item=> item.id === +req.params.id);
    if(!isHasVideo){
      res.send(404);
      return;
    }
    if(validationBody(req,res, true)) return;
    actions.updateVideo(req.body, +req.params.id);
    res.send(204);
  }catch (e) {
    console.log(e)
    res.send(404);
  }
});

app.delete('/videos/:id', (req:Request, res:Response) => {
  try {
    const result = checkIdParams(req, res);
    if(!result) return undefined;
    actions.deleteVideo(+req.params.id);
    res.json(result);
  }catch (e) {
    console.log(e);
    res.send(404)
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
