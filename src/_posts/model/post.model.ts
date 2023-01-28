export interface PostModel {
  "id": string,
  "title": string,
  "shortDescription": string,
  "content": string,
  "blogId": string,
  "blogName": string,
  "createdAt": string
}

export interface CreatePostModel {
  "title": string,
  "shortDescription": string,
  "content": string,
  "blogId": string,
}
