import mongoose from 'mongoose';

export interface ISecurityModel {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: string;
  expireAt: Date;
  createdAt?: Date;
  updateAt?: Date;
}

export const SecuritySchema = new mongoose.Schema<ISecurityModel>({
  ip: {type: String, require: true},
  title: {type: String, require: true},
  lastActiveDate: { type: Date, default: Date.now, require: true },
  expireAt: { type: Date, default: Date.now, require: true },
  deviceId: { type: String, require: true },
  userId: { type: String,  require: true },
}, { timestamps: true });

SecuritySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const SecurityEntity = mongoose.model('security', SecuritySchema);
