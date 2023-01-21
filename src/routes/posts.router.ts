import {Router, Response, Request} from 'express';
import {postRepository} from '../repository/post.repository';
import {validationBlogParamId} from '../middleware/blogs';
import {myValidationResult} from '../index';
import { schemaPost } from '../middleware/posts';
import { checkSchema } from 'express-validator';
import {middlewareBasicAuth} from '../middleware/auth';


export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response)=> {
  const allPosts = await postRepository.getAllPosts();
  return res.json(allPosts);
});

postsRouter.get('/:id', async (req: Request, res: Response)=> {
  const findPost = await postRepository.getPostById(req.params.id.toString());
  if(!findPost){
    return res.sendStatus(404);
  }
  return res.json(findPost);
});

postsRouter.post('/', middlewareBasicAuth, checkSchema(schemaPost(false)) , async (req: Request, res: Response) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }
  const body = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  }
  const newPost = await postRepository.createPost(body);
  res.status(201).json(newPost);
});

postsRouter.put('/:id',middlewareBasicAuth, checkSchema(schemaPost(true)), async (req: Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }

  const body = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  }

  const updatedPost = await postRepository.updatePost(req.params.id, body);
  if(!updatedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
});

postsRouter.delete('/:id', middlewareBasicAuth, validationBlogParamId, async (req:Request, res: Response)=> {
  const deletedPost = await postRepository.deletePost(req.params.id);
  if(!deletedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
