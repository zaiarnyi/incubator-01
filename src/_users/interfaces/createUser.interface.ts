import {ObjectId} from 'mongodb';

export interface IModalUser {
  login: string,
  password: string,
  email: string
}

export interface ICreateUser {
  hash: string;
  login: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
  activationCode?: string;
}

export interface IFullInfoUser {
  hash: string;
  login: string;
  email: string;
  createdAt: string;
  id: ObjectId
}

