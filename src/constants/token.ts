export const TOKEN_EXPIRE_TIME = {
  refreshToken: 20,
  accessToken: 10
}

export const HTTPS_ONLY_COOKIES = process.env.NODE_ENV === 'production';
export const SECURITY_COOKIE = process.env.NODE_ENV === 'production';
