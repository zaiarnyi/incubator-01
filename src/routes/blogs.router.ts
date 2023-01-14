import {Router, Response, Request} from 'express';
import {blogRepository} from '../repository/blog.repository';


export const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response)=> {
  return res.json(blogRepository.getAllBlogs());
});

blogsRouter.get('/:id', (req: Request, res: Response)=> {
  const findBlog = blogRepository.getBlogById(req.params.id);
  if(!findBlog){
    return res.send(404);
  }
  return res.json(findBlog);
});

blogsRouter.post('/', (req: Request, res: Response) => {
  const newBlog = blogRepository.createBlog(req.body);
  res.status(201).json(newBlog);
});

blogsRouter.put('/:id', (req: Request, res: Response)=> {
  const updatedBlog = blogRepository.updateBlog(req.params.id, req.body);
  if(!updatedBlog){
    return res.send(404)
  }
  return res.send(204);
});

blogsRouter.delete('/:id', (req:Request, res: Response)=> {
  const deletedBlog = blogRepository.deleteBlog(req.params.id);
  if(!deletedBlog){
    return res.send(404)
  }
  return res.send(204);
})
