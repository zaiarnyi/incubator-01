import {INewestLikes} from '../interfaces/likesCount.interface';
import {ObjectId} from 'mongodb';

export interface OutputViewModalPost {
  "pagesCount": number,
  "page": number,
  "pageSize": number,
  "totalCount": number,
  "items": PostModel[]
}

export interface PostModel {
  "id": string | ObjectId,
  "title": string,
  "shortDescription": string,
  "content": string,
  "blogId": string,
  "blogName": string,
  "createdAt": string,
}

export interface FullPostModal extends PostModel {
  extendedLikesInfo: {
    likesCount: number;
    newestLikes: INewestLikes[];
    dislikesCount: number;
    myStatus: string

  }
}

export interface CreatePostModel {
  "title": string,
  "shortDescription": string,
  "content": string,
  "blogId": string,
}
