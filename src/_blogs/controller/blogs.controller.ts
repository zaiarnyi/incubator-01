import {Request, Response} from 'express';
import {detectErrors} from '../../utils/helpers';
import {queryBlogsRepository} from '../repository/query.repository';
import {BlogService} from '../services/blog.service';
import {QueryPostsRepository} from '../../_posts/repository/query.repository';
import {PostRepository} from '../../_posts/repository/post.repository';

export class BlogsController {
  constructor(
    private readonly blogService: BlogService,
    private readonly queryPostsRepository: QueryPostsRepository,
    private readonly postServices: PostRepository) {}
  async getBlogs(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const allPosts = await queryBlogsRepository.getAllBlogs(req.query)
    return res.json(allPosts);
  }

  async getBlogById(req: Request, res: Response) {
    const findBlog = await queryBlogsRepository.getBlogById(req.params.id);
    if (!findBlog) {
      return res.sendStatus(404);
    }
    return res.json(findBlog);
  }

  async getPostByBlogId(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    if (!await queryBlogsRepository.getBlogById(req.params.id)) {
      res.sendStatus(404);
      return;
    }
    const userId = req.user?.id.toString();
    const result = await this.queryPostsRepository.getPostsByBlogId(req.params.id, req.query, userId);
    res.json(result);
  }

  async createBlog(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const newBlog = await this.blogService.createBlog(req.body);
    if (!newBlog) {
      return res.status(400).send('error');
    }
    res.status(201).json(newBlog);
  }

  async createPostByBlogId(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    if (!await queryBlogsRepository.getBlogById(req.params.id)) {
      res.sendStatus(404);
      return;
    }
    const result = await this.postServices.createPost({...req.body, blogId: req.params.id});
    res.status(201).json(result);
  }

  async updateBlogById(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    if (!await queryBlogsRepository.getBlogById(req.params.id)) {
      res.sendStatus(404);
      return;
    }
    const updatedBlog = await this.blogService.updateBlog(req.params.id, req.body);
    if (!updatedBlog) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204);
  }

  async deleteById(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    if (!await queryBlogsRepository.getBlogById(req.params.id)) {
      res.sendStatus(404)
      return
    }
    const deletedBlog = await this.blogService.removeBlog(req.params.id);
    if (!deletedBlog) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204);
  }
}
