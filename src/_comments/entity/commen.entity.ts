import mongoose from 'mongoose';



export interface ICommentModel {
  id?: string;
  content: string;
  commentatorInfo: {
    userId: string,
    userLogin: string
  },
  postId?: string;
  createdAt?: string
}

export const CommentSchema = new mongoose.Schema<ICommentModel>({
  content: {type: String, required: true},
  commentatorInfo: {
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
  },
  postId: {type: String},
}, { timestamps: true });

CommentSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const CommentEntity = mongoose.model('comments', CommentSchema);
