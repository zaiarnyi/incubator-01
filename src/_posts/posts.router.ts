import {Request, Response, Router} from 'express';
import {postRepository} from './repository/post.repository';
import {validationBlogParamId} from '../middleware/blogs';
import {schemaPost} from '../middleware/posts';
import {checkSchema} from 'express-validator';
import {middlewareBasicAuth} from '../middleware/auth';
import {queryRepository} from './repository/query.repository';
import {detectErrors} from '../utils/helpers';
import {postServices} from './services/post.services';


export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response)=> {
  const allPosts = await queryRepository.getAllPosts();
  return res.json(allPosts);
});

postsRouter.get('/:id', async (req: Request, res: Response)=> {
  const findPost = await queryRepository.getPostById(req.params.id);
  if(!findPost){
    return res.sendStatus(404);
  }
  return res.json(findPost);
});

postsRouter.post('/', middlewareBasicAuth, checkSchema(schemaPost(false)) , async (req: Request, res: Response) => {
  if(detectErrors(req, res)){
    return;
  }
  const newPost = await postServices.createPost(req.body);
  if(!newPost){
    return res.status(400).send('Error');
  }
  return res.status(201).json(newPost);
});

postsRouter.put('/:id',middlewareBasicAuth, checkSchema(schemaPost(true)), async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  const updatedPost = await postServices.updatePost(req.params.id, req.body);
  if(!updatedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
});

postsRouter.delete('/:id', middlewareBasicAuth, validationBlogParamId, async (req:Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  const deletedPost = await postServices.deletePost(req.params.id);
  if(!deletedPost){
    return res.sendStatus(404)
  }
  return res.sendStatus(204);
})
