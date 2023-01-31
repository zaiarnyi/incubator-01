import {postsCollection, usersCollection} from '../../DB';
import {mappingQueryParamsBlogsAndPosts} from '../../utils/queryParamsForUsers';
import {UserModel} from '../Model/user.model';
import {IQueryParamsUsers} from '../interfaces/params.interface';
import {IUserOutPut} from '../interfaces/outputUsers.interface';
import {ICreateUser} from '../interfaces/createUser.interface';

export const userQueryRepository = {
  async getAllUsers(queryParams: IQueryParamsUsers): Promise<IUserOutPut>{
    const params = mappingQueryParamsBlogsAndPosts(queryParams);

    // Math
    const totalCount = await usersCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / params.limit);
    const skip = (params.pageNumber - 1) * params.limit;

    const users = await usersCollection
      .find(params.searchRegex, {projection: {"id": "$_id", login: 1, email: 1, createdAt: 1, _id: 0 }})
      .sort(params.sortBy, params.sortDirection)
      .limit(params.limit)
      .skip(skip)
      .toArray() as UserModel[]

    return this._additionalInfo(pagesCount, params.pageNumber, params.limit, totalCount, users)
  },
  async detectUser(login: string, email: string, hash: string){
    return usersCollection.findOne({$or: [{login}, {email}], hash})
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
