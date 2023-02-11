import {UserModel} from '../_users/Model/user.model';

declare global{
  declare namespace Express {
    export interface Request {
      user?: UserModel | null
    }
  }
}
