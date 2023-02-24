import express, {Application, Request, Response} from 'express';
import {videosRouter} from './_videos/video.route';
import {videoRepository} from './_videos/repository/video.repository';
import {blogsRouter} from './_blogs/blogs.router';
import {postsRouter} from './_posts/posts.router';
import {validationResult} from 'express-validator';
import {DB, disconnectDB, runConnectionToMongo} from './DB';
import {Server} from 'http';
import {usersRouter} from './_users/users.router';
import {authRouter} from './_auth/auth.router';
import {commentsRouter} from './_comments/comment.router';
import {constants} from 'http2';
import {CommentsRepository} from './_comments/repository/comments.repository';
import {securityRouter} from './_security/index.router';
import {BlogService} from './_blogs/services/blog.service';
import {UserEntity} from './_users/Entity/user.entity';
import {DB_NAME_COLLECTION_PRODUCTS} from './constants';

const port = process.env.PORT || 3001;
const parseMiddleware = express.json();
export const app: Application = express();
export const myValidationResult = validationResult.withDefaults({
  formatter: error => ({
    message: error.msg,
    field: error.param,
  }),
});
app.set('trust proxy', true)

app.use(parseMiddleware);
app.use('/videos', videosRouter);
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
app.use('/security', securityRouter);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  try {
    await Promise.all([
      videoRepository.deleteAll(),
      BlogService.deleteBlogs(),
      DB(DB_NAME_COLLECTION_PRODUCTS).deleteMany({}),
      UserEntity.deleteMany({}),
      CommentsRepository.removeAllComments(),
    ])
  }catch (e) {
    console.log(e)
  }
  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
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
}catch (e) {
  console.log(e)
}
};

initServer();
