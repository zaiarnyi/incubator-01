import express, {Application, Request, Response} from 'express';
import {videosRouter} from './_videos/video.route';
import {videoRepository} from './_videos/repository/video.repository';
import {blogsRouter} from './_blogs/blogs.router';
import {postsRouter} from './_posts/posts.router';
import {validationResult} from 'express-validator';
import {disconnectDB, runConnectionToMongo} from './DB';
import {Server} from 'http';
import {postServices} from './_posts/services/post.services';
import {blogService} from './_blogs/services/blog.service';

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

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  videoRepository.deleteAll();
  await blogService.deleteBlogs();
  await postServices.deletePosts();
  res.sendStatus(204);
});


export let server: undefined | Server;

server?.on('close', async  ()=> {
  disconnectDB();
  server?.removeAllListeners();
});


export const initServer = async  ()=> {
try {
  await runConnectionToMongo();
  server = app.listen(port,  () => {
    console.log(`Example app listening on port ${port}`);
  });
}catch (e) {}
};

initServer();
