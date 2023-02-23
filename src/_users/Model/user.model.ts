import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

export interface UserModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
  hash: string;
  activation?:{
    code: string;
    expireAt: Date;
  };
  isSendEmail?: boolean;
}

export const UserSchema = new mongoose.Schema<UserModel>({
  id: {type: String, _id: true},
  login: {type: String, require: true},
  email: {type: String, require: true},
  hash: {type: String, require: true},
  isConfirm: {type: Boolean, require: true, default: false},
  activation: {
    code: {type: String, default: ''},
    expireAt: { type: Date, default: Date.now },
  },
  isSendEmail: {type: Boolean, default: false}
}, { timestamps: true });


UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const UserEntity = mongoose.model('users', UserSchema);


