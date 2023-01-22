import express, {Application, Request, Response} from 'express';

import {videosRouter} from './routes/video.route';
import {videoRepository} from './repository/video.repository';
import {blogRepository} from './repository/blog.repository';
import {postRepository} from './repository/post.repository';
import {blogsRouter} from './routes/blogs.router';
import {postsRouter} from './routes/posts.router';
import {validationResult} from 'express-validator';
import {runConnectionToMongo} from './DB';
import {Db} from 'mongodb';

const port = process.env.PORT || 3001;
const parseMiddleware = express.json();
export const app: Application = express();

export const myValidationResult = validationResult.withDefaults({
  formatter: error => ({
    message: error.msg,
    field: error.param,
  }),
});

app.use(parseMiddleware);
app.use('/videos', videosRouter);
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);

app.delete('/testing/all-data', async (req: Request, res:Response) => {
  videoRepository.deleteAll();
  await blogRepository.deleteBlogs();
  await postRepository.deletePosts();
  res.sendStatus(204);
});


app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
<h2>PORT: ${port}</h2>
<h2>PORT: ${process.env.MONGO_DB_URL}</h2>
<h3>Ukrainian time: ${new Date().toLocaleString("ua", {timeZone: "Europe/Kiev"})}</h3>
`)
})


export let DB: Db | undefined;

export const server = app.listen(port,  () => {
  console.log(`Example app listening on port ${port}`);
  runConnectionToMongo()
    .then((db)=> {
      DB = db;
      console.log("Connected successfully to database");
    })
    .catch(() => {
      console.log('Connection to the database failed');
      server.close();
    });
});
