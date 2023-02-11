import {BlogModel, CreateBlogModel} from '../model/blog.model';
import {blogRepository} from '../repository/blog.repository';

export const blogService = {
  async createBlog(body: CreateBlogModel): Promise<BlogModel> {
    const newBlog = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }
    const createResult = await blogRepository.createBlog({...newBlog});
    return {...newBlog, id: createResult.insertedId.toString()}
  },
  async updateBlog(id: string, body: CreateBlogModel) {
    const forUpdate = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    }
    const resultUpdated = await blogRepository.updateBlog(id, forUpdate)
    return resultUpdated.ok === 1;
  },
  async removeBlog(id: string): Promise<boolean> {
    const deleteResult = await blogRepository.deleteBlog(id);
    return deleteResult.deletedCount === 1;
  },
  async deleteBlogs(): Promise<void> {
    await blogRepository.deleteBlogs();
  }
}
