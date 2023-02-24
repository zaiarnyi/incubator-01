import mongoose from 'mongoose';

export interface IRefreshListInterface {
  userId: string;
  token_list: string[];
  createdAt?: Date;
  updateAt: Date;
}

export const RefreshListSchema = new mongoose.Schema<IRefreshListInterface>({
  userId: {type: String, required: true},
  token_list: {type: [String], required: true}
}, { timestamps: true });


RefreshListSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const RefreshListEntity = mongoose.model('refresh_token_list', RefreshListSchema);


