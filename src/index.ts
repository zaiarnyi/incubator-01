import express, {Application, Request, Response} from 'express';

import {videosRouter} from './routes/video.route';
import {videoRepository} from './repository/video.repository';
import {blogRepository} from './repository/blog.repository';
import {postRepository} from './repository/post.repository';
import {blogsRouter} from './routes/blogs.router';
import {postsRouter} from './routes/posts.router';
import {validationResult} from 'express-validator';

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

if(process.env.VERCEL_ENV !== 'production'){
  app.delete('/testing/all-data', (req: Request, res:Response) => {
    videoRepository.deleteAll();
    blogRepository.deleteBlogs();
    postRepository.deletePosts();
    res.sendStatus(204);
  })
}

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
<h2>PORT: ${port}</h2>
<h3>Time: ${new Date().toLocaleString("ua", {timeZone: "Europe/Kiev"})}</h3>
<h3>${process.env.BASIC_LOGIN} | ${process.env.BASIC_PASSWORD}</h3>
`)
})

export const server = app.listen(port,  () => {
  console.log(`Example app listening on port ${port}`)
});
