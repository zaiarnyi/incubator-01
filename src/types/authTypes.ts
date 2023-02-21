export type UserFromJWT = {
  id: string,
  deviceId?: string;
  iat: number,
  exp: number
}
