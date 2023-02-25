import {PostController} from './controller/post.controller';
import {CommentQueryRepository} from '../_comments/repository/query.repository';
import {QueryPostsRepository} from './repository/query.repository';
import {PostServices} from './services/post.services';
import {PostRepository} from './repository/post.repository';
import {CommentsRepository} from '../_comments/repository/comments.repository';

const queryPostsRepository = new QueryPostsRepository();
const postRepository = new PostRepository();
const commentQueryRepository = new CommentQueryRepository();
const commentsRepository = new CommentsRepository();
const postServices = new PostServices(commentsRepository, postRepository, commentQueryRepository);
export const postController = new PostController(commentQueryRepository, queryPostsRepository, postServices);
