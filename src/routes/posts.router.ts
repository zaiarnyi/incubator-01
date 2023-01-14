import {Router, Response, Request} from 'express';
import {postRepository} from '../repository/post.repository';


export const postsRouter = Router();

postsRouter.get('/', (req: Request, res: Response)=> {
  return res.json(postRepository.getAllPosts());
});

postsRouter.get('/:id', (req: Request, res: Response)=> {
  const findPost = postRepository.getPostById(req.params.id);
  if(!findPost){
    return res.send(404);
  }
  return res.json(findPost);
});

postsRouter.post('/', (req: Request, res: Response) => {
  const newPost = postRepository.createPost(req.body);
  res.sendStatus(201).json(newPost);
});

postsRouter.put('/:id', (req: Request, res: Response)=> {
  const updatedPost = postRepository.updatePost(req.params.id, req.body);
  if(!updatedPost){
    return res.send(404)
  }
  return res.send(204);
});

postsRouter.delete('/:id', (req:Request, res: Response)=> {
  const deletedPost = postRepository.deletePost(req.params.id);
  if(!deletedPost){
    return res.send(404)
  }
  return res.send(204);
})
