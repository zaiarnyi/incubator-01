import express, {Application, Request, Response} from 'express';
import {videosRouter} from './routes/Video';
import {actions} from './repository';
import {route} from './utils/pathRoute';

const port = process.env.PORT || 3001;
const parseMiddleware = express.json();

export const app: Application = express();

app.use(parseMiddleware);
app.use(route + 'videos', videosRouter);

videosRouter.delete('/lesson1/testing/all-data', (req: Request, res:Response) => {
  actions.deleteAll();
  res.sendStatus(204);
})

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
<h1>ROUTE: ${route}</h1>
<h2>PORT: ${port}</h2>
<h3>Ukrainian time: ${new Date().toLocaleString("ua", {timeZone: "Europe/Kiev"})}</h3>
`)
})

export const server = app.listen(port,  () => {
  console.log(`Example app listening on port ${port}`)
});
