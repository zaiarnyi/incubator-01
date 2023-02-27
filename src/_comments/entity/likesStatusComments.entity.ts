import mongoose from 'mongoose';

export enum LikeStatus {
  None= 'None',
  Like= 'Like',
  Dislike= 'Dislike',
}

interface ILikeModel {
  userId: string
  like: boolean
  dislike: boolean
  myStatus: LikeStatus;
  postId: string;
  commentId: string;
  login: string,
}

const LikeStatusCommentsSchema = new mongoose.Schema<ILikeModel>({
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

LikeStatusCommentsSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const LikeStatusCommentsEntity = mongoose.model('comment_like_status', LikeStatusCommentsSchema);
