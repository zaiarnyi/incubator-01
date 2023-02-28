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
  login: string,
}

const LikeStatusPostCommentsSchema = new mongoose.Schema<ILikeModel>({
  userId: {type: String, default: null},
  like: {type: Boolean, required: true, default: false},
  dislike: {type: Boolean, required: true, default: false},
  myStatus: {type: String, enum: [LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike], default: LikeStatus.None},
  postId: {type: String, default: null},
  login: {type: String, default: null},
}, {
  timestamps: {
    createdAt: 'addedAt',
    updatedAt: 'updatedAt'
  }
});

LikeStatusPostCommentsSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const LikeStatusPostCommentsEntity = mongoose.model('post_like_status', LikeStatusPostCommentsSchema);
