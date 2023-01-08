import express, {Request, Response} from 'express';
import {videosRouter} from './routes/Video';
import {actions} from './repository';

const port = process.env.PORT || 3000;
const parseMiddleware = express.json();

export const app = express();
app.use(parseMiddleware);
app.use('/videos', videosRouter);

app.delete('/testing/all-data', (req: Request, res:Response) => {
  actions.deleteAll();
  res.send(204);
})

app.get('/', (req, res) => {
  res.send(process.env.API_ROUTE)
})

app.listen(port,  () => {
  console.log(`Example app listening on port ${port}`)
});
