import {PostModel} from '../models/post.model';

let postsData : Array<PostModel> = Array.from({length: 10}, (_, i)=> ({
  "id": i.toString(),
  "title": "string",
  "shortDescription": "string",
  "content": "string",
  "blogId": i.toString(),
  "blogName": "string"
}))

export const postRepository = {
  getAllPosts (): Array<PostModel> { return postsData },
  getPostById (id: string): PostModel | undefined {
    return postsData.find(item => item.id === id);
  },
  createPost (body: Omit<PostModel, "id" | "blogName">): PostModel {
    const lastId = +postsData[postsData?.length - 1]?.id || 0;
    const newPost = {
      id: (lastId + 1).toString(),
      blogName: body.title.split(' ').join('-'),
      ...body,
    }
    postsData.push(newPost);
    return newPost;
  },
  updatePost (id: string, body: Omit<PostModel, "id" | "blogName">): boolean {
    const findBlog = postsData.find(item => item.id === id);
    if(!findBlog) return false;
    postsData = postsData.map(item => {
      if(item.id === id){
        return {
          ...body,
          blogName: body.title.split(' ').join('-'),
          id,
        }
      }
      return item;
    });
    return true;
  },
  deletePost (id: string): boolean{
    const findBlog = postsData.find(item => item.id === id);
    if(!findBlog) return false;
    postsData = postsData.filter(item => item.id === id);
    return true;
  },
  deletePosts () {
    postsData = [];
    return postsData;
  }
}
