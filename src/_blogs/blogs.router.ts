import {Request, Response, Router} from 'express';
import {
  validationBlogBodyContent,
  validationBlogBodyDescription,
  validationBlogBodyName,
  validationBlogBodyShortDescription,
  validationBlogBodyTitle,
  validationBlogBodyUrl,
  validationBlogParamId,
  validationBlogParamPages,
  validationBlogParamSortBy,
  validationBlogParamSortDirection
} from '../middleware/blogs';
import {middlewareBasicAuth} from '../middleware/auth';
import {queryBlogsRepository} from './repository/query.repository';
import {blogService} from './services/blog.service';
import {detectErrors} from '../utils/helpers';
import {queryPostsRepository} from '../_posts/repository/query.repository';
import {postServices} from '../_posts/services/post.services';


export const blogsRouter = Router();

blogsRouter.get('/', validationBlogParamSortBy, validationBlogParamSortDirection, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  const allPosts = await queryBlogsRepository.getAllBlogs(req.query)
  return res.json(allPosts);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  const findBlog = await queryBlogsRepository.getBlogById(req.params.id);
  if(!findBlog){
    return res.sendStatus(404);
  }
  return res.json(findBlog);
});

blogsRouter.get('/:id/posts', validationBlogParamId, validationBlogParamSortBy, validationBlogParamSortDirection, validationBlogParamPages, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  if(!await queryBlogsRepository.getBlogById(req.params.id)){
    res.sendStatus(404);
    return;
  }
  const result = await queryPostsRepository.getPostsByBlogId(req.params.id, req.query);
  res.json(result);
})

blogsRouter.post('/', middlewareBasicAuth, validationBlogBodyName, validationBlogBodyDescription,validationBlogBodyUrl,  async (req: Request, res: Response) => {
  if(detectErrors(req, res)){
    return;
  }
  const newBlog = await blogService.createBlog(req.body);
  if(!newBlog){
    return res.status(400).send('error');
  }
  res.status(201).json(newBlog);
});

blogsRouter.post('/:id/posts',middlewareBasicAuth, validationBlogParamId, validationBlogBodyTitle, validationBlogBodyShortDescription, validationBlogBodyContent,  async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  if(!await queryBlogsRepository.getBlogById(req.params.id)){
    res.sendStatus(404);
    return;
  }
  const result = await postServices.createPost({...req.body, blogId: req.params.id});
  res.status(201).json(result);
})

blogsRouter.put('/:id',middlewareBasicAuth, validationBlogParamId, validationBlogBodyName, validationBlogBodyDescription,validationBlogBodyUrl, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  if(!await queryBlogsRepository.getBlogById(req.params.id)){
    res.sendStatus(404);
    return;
  }
  const updatedBlog = await blogService.updateBlog(req.params.id, req.body);
  if(!updatedBlog){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
});

blogsRouter.delete('/:id',middlewareBasicAuth, validationBlogParamId, async (req:Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  if(!await queryBlogsRepository.getBlogById(req.params.id)){
    res.sendStatus(404)
    return
  }
  const deletedBlog = await blogService.removeBlog(req.params.id);
  if(!deletedBlog){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
