import {Request, Response} from 'express';
import {detectErrors} from '../../utils/helpers';
import {QueryPostsRepository} from '../repository/query.repository';
import {IUserEntity} from '../../_users/Entity/user.entity';
import {CommentQueryRepository} from '../../_comments/repository/query.repository';
import {PostServices} from '../services/post.services';

export class PostController {

  constructor(
    private readonly commentQueryRepository: CommentQueryRepository,
    private readonly queryPostsRepository: QueryPostsRepository,
    private readonly postServices: PostServices,
    ) {}

  async getPosts(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const allPosts = await this.queryPostsRepository.getAllPosts(req.query, req.user?.id?.toString());
    return res.json(allPosts);
  }

  async getPostById(req: Request, res: Response) {
    let findPost = await this.queryPostsRepository.getPostById(req.params.id);
    if (!findPost) {
      return res.sendStatus(404);
    }
    const fp = await this.queryPostsRepository.postWithLikesInfo([findPost], req.user?.id?.toString());
    return res.json(fp[0]);
  }

  async createPost(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const newPost = await this.postServices.createPost(req.body);
    if (!newPost) {
      return res.status(400).send('Error');
    }
    return res.status(201).json(newPost);
  }
  async getCommentsByIdPost(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    let userId =  req.user?.id?.toString() || '';
    const comments = await this.commentQueryRepository.getCommentFromPost(req.params.postId, req.query, userId);
    res.json(comments);
  }

  async createCommentByIdPost(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }

    const findPost = await this.queryPostsRepository.getPostById(req.params.postId);
    if (!findPost) {
      return res.sendStatus(404);
    }
    const createdComment = await this.postServices.createCommentToPost(req.body, req.params.postId, req.user as IUserEntity);
    res.status(201).json(createdComment)
  }

  async updateLikeStatusForCommentByPost(req: Request, res: Response){
    if (detectErrors(req, res)) {
      return
    }
    const userId = req.user?.id?.toString() || '';
    const login = req.user?.login;
    const postId = req.params.postId;
    const findPost = await this.queryPostsRepository.getPostById(postId);

    if (!findPost) {
      return res.sendStatus(404);
    }
    await this.postServices.updateStatusCommentToPost(userId, postId, req.body.likeStatus, login);
    res.sendStatus(204);

  }

  async updatePostById(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    if (!await this.queryPostsRepository.getPostById(req.params.id)) {
      return res.sendStatus(404);
    }
    const updatedPost = await this.postServices.updatePost(req.params.id, req.body);
    if (!updatedPost) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204);
  }

  async deletePostById(req: Request, res: Response) {
    if (detectErrors(req, res)) {
      return
    }
    const deletedPost = await this.postServices.deletePost(req.params.id);
    if (!deletedPost) {
      return res.sendStatus(404)
    }
    return res.sendStatus(204);
  }
}
