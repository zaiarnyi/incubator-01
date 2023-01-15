import {Router, Response, Request} from 'express';
import {postRepository} from '../repository/post.repository';
import {validationBlogParamId} from '../middleware/blogs';
import {myValidationResult} from '../index';
import { schemaPost } from '../middleware/posts';
import { checkSchema } from 'express-validator';


export const postsRouter = Router();

postsRouter.get('/', (req: Request, res: Response)=> {
  return res.json(postRepository.getAllPosts());
});

postsRouter.get('/:id', (req: Request, res: Response)=> {
  const findPost = postRepository.getPostById(req.params.id);
  if(!findPost){
    return res.sendStatus(404);
  }
  return res.json(findPost);
});

postsRouter.post('/', checkSchema(schemaPost(false)) ,(req: Request, res: Response) => {
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
  const newPost = postRepository.createPost(body);
  res.status(201).json(newPost);
});

postsRouter.put('/:id', checkSchema(schemaPost(true)), (req: Request, res: Response)=> {
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

  const updatedPost = postRepository.updatePost(req.params.id, body);
  if(!updatedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
});

postsRouter.delete('/:id', validationBlogParamId, (req:Request, res: Response)=> {
  const deletedPost = postRepository.deletePost(req.params.id);
  if(!deletedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
