export const TOKEN_EXPIRE_TIME = {
  refreshToken: process.env.NODE_ENV === 'production' ? 20 : 60,
  accessToken: process.env.NODE_ENV === 'production' ? 10 : 60,
}

export const HTTPS_ONLY_COOKIES = process.env.NODE_ENV === 'production';
export const SECURITY_COOKIE = process.env.NODE_ENV === 'production';
