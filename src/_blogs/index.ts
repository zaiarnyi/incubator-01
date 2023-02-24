import {BlogsController} from './controller/blogs.controller';
import {BlogService} from './services/blog.service';
import {QueryPostsRepository} from '../_posts/repository/query.repository';
import {PostRepository} from '../_posts/repository/post.repository';

const queryPostsRepository = new QueryPostsRepository();
const blogService = new BlogService();
const postRepository = new PostRepository();
export const blogsController = new BlogsController(blogService, queryPostsRepository, postRepository);
