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
    private readonly postServices: PostRepository) {
  }

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
    const blog = await queryBlogsRepository.getBlogById(req.params.id)
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const cratedResult = await this.postServices.createPost({...req.body, blogId: req.params.id, blogName: blog.name.split(' ').join('-'), createdAt: new Date().toISOString()});
    const response = {
      id: cratedResult.insertedId.toString(),
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      blogId: req.params.id,
      blogName: blog.name.split(' ').join('-'),
      content: req.body.content,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []
      }
    }
    res.status(201).json(response);
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
