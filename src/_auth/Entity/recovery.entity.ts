import mongoose, {model} from 'mongoose';

interface IUserRecovery {
  email: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  isSendEmail: boolean;
}

export const UserRecoverySchema = new mongoose.Schema<IUserRecovery>({
  email: {type: String, required: true},
  isSendEmail: {type: Boolean, required: true, default: false},
  code: {type: String, required: true, minlength: 7, maxlength: 7}
}, { timestamps: true });

UserRecoverySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
export const UserRecoveryEntity = mongoose.model('recovery', UserRecoverySchema);
