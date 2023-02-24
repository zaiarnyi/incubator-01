import {CommentController} from './controller/comment.controller';
import {CommentService} from './comment.service';
import {CommentQueryRepository} from './repository/query.repository';
import {CommentsRepository} from './repository/comments.repository';


const commentsRepository = new CommentsRepository();
const commentQueryRepository = new CommentQueryRepository();
const commentService = new CommentService(commentsRepository);
export const commentController = new CommentController(commentService, commentQueryRepository);
