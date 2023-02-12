import {Request, Response, Router} from 'express';
import {validationBlogParamId} from '../middleware/blogs';
import {schemaPost} from '../middleware/posts';
import {checkSchema} from 'express-validator';
import {
  middlewareBasicAuth,
  validationBearer,
  validationCommentContent,
  validationPostParamPages,
  validationPostParamSortBy,
  validationPostParamSortDirection
} from '../middleware/auth';
import {queryPostsRepository} from './repository/query.repository';
import {detectErrors} from '../utils/helpers';
import {postServices} from './services/post.services';
import {UserModel} from '../_users/Model/user.model';
import {commentQueryRepository} from '../_comments/repository/query.repository';


export const postsRouter = Router();

postsRouter.get('/', validationPostParamSortBy, validationPostParamSortDirection, validationPostParamPages, async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  const allPosts = await queryPostsRepository.getAllPosts(req.query);
  return res.json(allPosts);
});

postsRouter.get('/:id',  async (req: Request, res: Response)=> {
  const findPost = await queryPostsRepository.getPostById(req.params.id);
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

postsRouter.get('/:postId/comments', validationPostParamSortBy, validationPostParamPages, async (req: Request, res: Response)=> {
    if(detectErrors(req,res)){
      return;
    }
    const findPost = await queryPostsRepository.getPostById(req.params.postId);
    if(!findPost){
      return res.sendStatus(404);
    }
    const comments = await commentQueryRepository.getCommentFromPost(req.params.postId, req.query);
    res.json(comments);
});


postsRouter.post('/:postId/comments', validationBearer,validationCommentContent, async (req: Request, res: Response) => {
  if(detectErrors(req, res)){
    return;
  }
  const findPost = await queryPostsRepository.getPostById(req.params.postId);
  if(!findPost){
    return res.sendStatus(404);
  }
  const createdComment = await postServices.createCommentToPost(req.body, req.params.postId, req.user as UserModel);
  res.status(201).json(createdComment)
});

postsRouter.put('/:id',middlewareBasicAuth, checkSchema(schemaPost(true)), async (req: Request, res: Response)=> {
  if(detectErrors(req, res)){
    return;
  }
  if(!await queryPostsRepository.getPostById(req.params.id)){
    return res.sendStatus(404);
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
