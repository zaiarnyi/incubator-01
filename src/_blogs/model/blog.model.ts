export interface OutputViewModalBlog {
  "pagesCount": number,
  "page": number,
  "pageSize": number,
  "totalCount": number,
  "items": BlogModel[]
}

export interface QueryParamsGetBlogs {
  searchNameTerm?: string,
  sortBy?: string,
  sortDirection?: string,
  pageNumber?: string,
  pageSize?: string,
}

export interface BlogModel {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
}

export interface CreateBlogModel {
  name: string,
  description: string,
  websiteUrl: string,
}
