import {DB, usersCollection} from '../../DB';
import {mappingQueryParamsBlogsAndPosts} from '../../utils/queryParamsForUsers';
import {UserModel} from '../Model/user.model';
import {IQueryParamsUsers} from '../interfaces/params.interface';
import {IUserOutPut} from '../interfaces/outputUsers.interface';
import {ICreateUser} from '../interfaces/createUser.interface';
import {ObjectId, WithId} from 'mongodb';
import {DB_NAME_COLLECTION_USERS} from '../../constants';

export const userQueryRepository = {
  async getAllUsers(queryParams: IQueryParamsUsers): Promise<IUserOutPut>{
    const params = mappingQueryParamsBlogsAndPosts(queryParams);

    // Math
    const totalCount = await usersCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / params.limit);
    const skip = (params.pageNumber - 1) * params.limit;

    const users = await DB<UserModel>(DB_NAME_COLLECTION_USERS)
      .find(params.searchRegex, {projection: {"id": "$_id", login: 1, email: 1, createdAt: 1, _id: 0 }})
      .sort(params.sortBy, params.sortDirection)
      .limit(params.limit)
      .skip(skip)
      .toArray() as UserModel[]

    return this._additionalInfo(pagesCount, params.pageNumber, params.limit, totalCount, users)
  },
  async detectUser(loginOfEmail: string): Promise<ICreateUser | null>{
    return DB<ICreateUser>(DB_NAME_COLLECTION_USERS).findOne({$or: [{login:loginOfEmail}, {email: loginOfEmail}]})
  },
  async getUserById(id: string): Promise<UserModel | null>{
    return await DB<UserModel>(DB_NAME_COLLECTION_USERS).findOne({_id: new ObjectId(id)})
  },
  _additionalInfo(pagesCount: number, pageNumber: number, limit: number, totalCount:number, items: UserModel[]): IUserOutPut{
    return {
      pagesCount,
      pageNumber,
      limit,
      totalCount,
      items,
    }
  }
}