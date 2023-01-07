import express from 'express';
import {videosRouter} from './routes/Video';

const port = process.env.PORT || 3000
const parseMiddleware = express.json();

const app = express();
app.use(parseMiddleware);
app.use('/videos', videosRouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
