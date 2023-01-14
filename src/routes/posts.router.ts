import {Router, Response, Request} from 'express';
import {postRepository} from '../repository/post.repository';
import {validationBlogParamId} from '../middleware/blogs';
import {myValidationResult} from '../index';
import {
  validationPostBodyBlogId,
  validationPostBodyContent,
  validationPostBodyDescription,
  validationPostBodyTitle
} from '../middleware/posts';


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

postsRouter.post('/', validationPostBodyTitle, validationPostBodyDescription, validationPostBodyContent, validationPostBodyBlogId ,(req: Request, res: Response) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }

  const newPost = postRepository.createPost(req.body);
  res.status(201).json(newPost);
});

postsRouter.put('/:id', validationBlogParamId, validationPostBodyTitle, validationPostBodyDescription, validationPostBodyContent, validationPostBodyBlogId, (req: Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) });
  }

  const updatedPost = postRepository.updatePost(req.params.id, req.body);
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
