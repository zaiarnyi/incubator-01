export interface UserModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
  activation?:{
    code: string;
    expireAt: number;
  };
}
