import mongoose from 'mongoose';
import {LikeStatus} from '../../_comments/entity/likesStatusComments.entity';

interface ILikeModel {
  userId: string
  like: boolean
  dislike: boolean
  myStatus: LikeStatus;
  postId: string;
  commentId: string;
  login: string,
}

const LikeStatusPostSchema = new mongoose.Schema<ILikeModel>({
  userId: {type: String, required: true},
  like: {type: Boolean, required: true, default: false},
  dislike: {type: Boolean, required: true, default: false},
  myStatus: {type: String, enum: [LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike]},
  postId: {type: String, required: true},
  commentId: {type: String, required: true},
  login: {type: String, required: true},
}, {
  timestamps: {
    createdAt: 'addedAt',
    updatedAt: 'updatedAt'
  }
});

LikeStatusPostSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const LikeStatusPostEntity = mongoose.model('post_like_status', LikeStatusPostSchema);
