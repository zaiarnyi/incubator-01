import {DB, usersCollection} from '../../DB';
import {mappingQueryParamsUsers} from '../../utils/queryParamsForUsers';
import {IUserEntity} from '../Entity/user.entity';
import {IQueryParamsUsers} from '../interfaces/params.interface';
import {IUserOutPut} from '../interfaces/outputUsers.interface';
import {IFullInfoUser} from '../interfaces/createUser.interface';
import {ObjectId} from 'mongodb';
import {DB_NAME_COLLECTION_USERS} from '../../constants';

export const userQueryRepository = {
  async getAllUsers(queryParams: IQueryParamsUsers): Promise<IUserOutPut>{
    const params = mappingQueryParamsUsers(queryParams);
    // Math
    const totalCount = await usersCollection.countDocuments(params.searchRegex);
    const pagesCount = Math.ceil(totalCount / params.limit);
    const skip = (params.pageNumber - 1) * params.limit;

    const users = await DB<IUserEntity>(DB_NAME_COLLECTION_USERS)
      .find(params.searchRegex, {projection: {"id": "$_id", login: 1, email: 1, createdAt: 1, _id: 0 }})
      .sort(params.sortBy, params.sortDirection)
      .limit(params.limit)
      .skip(skip)
      .toArray() as IUserEntity[]

    return this._additionalInfo(pagesCount, params.pageNumber, params.limit, totalCount, users)
  },
  async detectUser(loginOfEmail: string): Promise<IFullInfoUser | null>{
    return DB<IFullInfoUser>(DB_NAME_COLLECTION_USERS).findOne({$or: [{login: loginOfEmail}, {email: loginOfEmail}]},
      {projection: {"id": "$_id", createdAt: 1, hash: 1, login: 1, email: 1, _id: 0, isConfirm: 1}})
  },
  async detectUserByEmailAndLogin(email: string, login:string): Promise<IFullInfoUser | null>{
    return DB<IFullInfoUser>(DB_NAME_COLLECTION_USERS).findOne({$or: [{login}, {email}]},
      {projection: {"id": "$_id", createdAt: 1, hash: 1, login: 1, email: 1, _id: 0, isConfirm: 1}})
  },
  async getUserById(id: string): Promise<IUserEntity | null>{
    return DB<IUserEntity>(DB_NAME_COLLECTION_USERS).findOne({_id: new ObjectId(id)},
      {projection: {"id": "$_id", createdAt: 1, login: 1, email: 1, _id: 0, isConfirm: 1}})
  },
  async getUserByCode(code: string){
    return usersCollection.findOne({$and: [
        {"activation.code": code},
        {"activation.expireAt": {$gt: Date.now()}},
      ]})
  },
  _additionalInfo(pagesCount: number, page: number, pageSize: number, totalCount:number, items: IUserEntity[]): IUserOutPut{
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items,
    }
  }
}
