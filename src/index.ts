import express, {Request, Response} from 'express';
import {videosRouter} from './routes/Video';
import {actions} from './repository';
import {route} from './utils/pathRoute';

const port = process.env.PORT || 3000;
const parseMiddleware = express.json();

export const app = express();
app.use(parseMiddleware);
app.use(route + 'videos', videosRouter);

app.delete(route + 'testing/all-data', (req: Request, res:Response) => {
  actions.deleteAll();
  res.send(204);
})
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
<h1>ROUTE:${route}</h1>
<h2>>PORT:${port}</h2>
<h3>Server date: ${new Date()}</h3>
`)
})

app.listen(port,  () => {
  console.log(`Example app listening on port ${port}`)
});
