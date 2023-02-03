import {DB, usersCollection} from '../../DB';
import {mappingQueryParamsUsers} from '../../utils/queryParamsForUsers';
import {UserModel} from '../Model/user.model';
import {IQueryParamsUsers} from '../interfaces/params.interface';
import {IUserOutPut} from '../interfaces/outputUsers.interface';
import {ICreateUser, IFullInfoUser} from '../interfaces/createUser.interface';
import {ObjectId} from 'mongodb';
import {DB_NAME_COLLECTION_USERS} from '../../constants';

export const userQueryRepository = {
  async getAllUsers(queryParams: IQueryParamsUsers): Promise<IUserOutPut>{
    const params = mappingQueryParamsUsers(queryParams);
    // Math
    const totalCount = await usersCollection.countDocuments(params.searchRegex);
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
  async detectUser(loginOfEmail: string): Promise<IFullInfoUser | null>{
    return DB<IFullInfoUser>(DB_NAME_COLLECTION_USERS).findOne({$or: [{login:loginOfEmail}, {email: loginOfEmail}]},
      {projection: {"id": "$_id", createdAt: 1, hash: 1, login: 1, email: 1, _id: 0}})
  },
  async getUserById(id: string): Promise<UserModel | null>{
    return await DB<UserModel>(DB_NAME_COLLECTION_USERS).findOne({_id: new ObjectId(id)},
      {projection: {"id": "$_id", createdAt: 1, login: 1, email: 1, _id: 0}})
  },
  _additionalInfo(pagesCount: number, page: number, pageSize: number, totalCount:number, items: UserModel[]): IUserOutPut{
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items,
    }
  }
}
