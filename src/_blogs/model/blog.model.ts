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
