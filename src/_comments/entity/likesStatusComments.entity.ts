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
  commentId: string;
}

const LikeStatusCommentsSchema = new mongoose.Schema<ILikeModel>({
  userId: {type: String, required: true},
  like: {type: Boolean, required: true, default: false},
  dislike: {type: Boolean, required: true, default: false},
  myStatus: {type: String, enum: [LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike]},
  commentId: {type: String, required: true},
}, { timestamps: true });

LikeStatusCommentsSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const LikeStatusCommentsEntity = mongoose.model('comment_like_status', LikeStatusCommentsSchema);
