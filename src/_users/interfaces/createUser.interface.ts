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
}

