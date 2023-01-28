import {Request, Response, Router} from 'express';
import {
  validationBlogBodyDescription,
  validationBlogBodyName,
  validationBlogBodyUrl,
  validationBlogParamId
} from '../middleware/blogs';
import {middlewareBasicAuth} from '../middleware/auth';
import {queryBlogsRepository} from './repository/query.repository';
import {blogService} from './services/blog.service';
import {detectErrors} from '../utils/helpers';


export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response)=> {
  const allPosts = await queryBlogsRepository.getAllBlogs()
  return res.json(allPosts);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  const findBlog = await queryBlogsRepository.getBlogById(req.params.id);
  if(!findBlog){
    return res.sendStatus(404);
  }
  return res.json(findBlog);
});

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

blogsRouter.put('/:id',middlewareBasicAuth, validationBlogParamId, validationBlogBodyName, validationBlogBodyDescription,validationBlogBodyUrl, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
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
  const deletedBlog = await blogService.removeBlog(req.params.id);
  if(!deletedBlog){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
