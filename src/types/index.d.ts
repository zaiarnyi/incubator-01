import {UserEntity} from '../_users/Entity/user.entity';

declare global{
  declare namespace Express {
    export interface Request {
      user?: UserEntity | null
    }
  }
}
