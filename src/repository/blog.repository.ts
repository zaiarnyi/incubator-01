import {BlogModel} from '../models/blog.model';


let blogsData : Array<BlogModel> = Array.from({length: 10}, (_, i)=> ({
  "id": i.toString(),
  "name": 'name' + (i + 1),
  "description": "description" + (i + 2),
  "websiteUrl": "https://nauchikus.gitlab.io/typescript-definitive-guide/book/contents"
}))

export const blogRepository = {
  getAllBlogs (): Array<BlogModel> { return blogsData },
  getBlogById (id: string): BlogModel | undefined {
    return blogsData.find(item => item.id === id);
  },
  createBlog (body: Omit<BlogModel, "id">): BlogModel {
    const lastId = +blogsData[blogsData?.length - 1]?.id || 0;
    const newPost = {
      id: (lastId + 1).toString(),
      ...body,
    }
    blogsData.push(newPost);
    return newPost;
  },
  updateBlog (id: string, body: Omit<BlogModel, "id">): boolean {
    const findBlog = blogsData.find(item => item.id === id);
    if(!findBlog) return false;
    blogsData = blogsData.map(item => {
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
  deleteBlog (id: string): boolean{
    const findBlog = blogsData.find(item => item.id === id);
    if(!findBlog) return false;
    blogsData = blogsData.filter(item => item.id === id);
    return true;
  },
  deleteBlogs () {
    blogsData = [];
    return blogsData;
  }
}
