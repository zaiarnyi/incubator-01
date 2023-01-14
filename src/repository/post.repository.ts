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
  createPost (body: Omit<PostModel, "id">): PostModel {
    const lastId = +postsData[postsData?.length - 1]?.id || 0;
    const newPost = {
      id: (lastId + 1).toString(),
      ...body,
    }
    postsData.push(newPost);
    return newPost;
  },
  updatePost (id: string, body: Omit<PostModel, "id">): boolean {
    const findBlog = postsData.find(item => item.id === id);
    if(!findBlog) return false;
    postsData = postsData.map(item => {
      if(item.id === id){
        return {
          id,
          ...body
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
