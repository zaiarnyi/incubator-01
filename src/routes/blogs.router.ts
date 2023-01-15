import {Router, Response, Request} from 'express';
import {blogRepository} from '../repository/blog.repository';
import {
  validationBlogBodyDescription,
  validationBlogBodyName,
  validationBlogBodyUrl,
  validationBlogParamId
} from '../middleware/blogs';
import {myValidationResult} from '../index';
import {middlewareBasicAuth} from '../middleware/auth';


export const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response)=> {
  return res.json(blogRepository.getAllBlogs());
});

blogsRouter.get('/:id', (req: Request, res: Response) => {
  const findBlog = blogRepository.getBlogById(req.params.id.toString());
  if(!findBlog){
    return res.sendStatus(404);
  }
  return res.json(findBlog);
});

blogsRouter.post('/', middlewareBasicAuth, validationBlogBodyName, validationBlogBodyDescription,validationBlogBodyUrl,  (req: Request, res: Response) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }
  const body = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl
  }
  const newBlog = blogRepository.createBlog(body);
  res.status(201).json(newBlog);
});

blogsRouter.put('/:id',middlewareBasicAuth, validationBlogParamId, validationBlogBodyName, validationBlogBodyDescription,validationBlogBodyUrl, (req: Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }
  const body = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl
  }
  const updatedBlog = blogRepository.updateBlog(req.params.id.toString(), body);
  if(!updatedBlog){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
});

blogsRouter.delete('/:id',middlewareBasicAuth, validationBlogParamId, (req:Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }

  const deletedBlog = blogRepository.deleteBlog(req.params.id.toString());
  if(!deletedBlog){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
