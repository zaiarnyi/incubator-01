export const route:string = (process.env.API_ROUTE || process.env.VERCEL_GIT_COMMIT_REF)?.replace(/feature/,'') + '/'
