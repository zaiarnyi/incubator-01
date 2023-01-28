import {BlogModel, OutputViewModalBlog} from '../model/blog.model';
import {DB} from '../../DB';
import {DB_NAME_COLLECTION_BLOG, DEFAULT_PAGE_SIZE} from '../../constants';
import {ObjectId, WithId} from 'mongodb';
import {queryPostsRepository} from '../../_posts/repository/query.repository';
import {QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';
import {OutputViewModalPost} from '../../_posts/model/post.model';


export const queryBlogsRepository = {
  async getAllBlogs (query: QueryParamsGet): Promise<OutputViewModalBlog> {
    //Read Query Params
    const searchNameTerm = query.searchNameTerm || '';
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query?.sortDirection === 'desc' ? -1 : 1;
    const pageNumber = +(query.pageNumber || 1);
    const limit = +(query.pageSize || DEFAULT_PAGE_SIZE);
    const searchRegex = {
      ...(searchNameTerm.length && {name: {$regex: searchNameTerm, $options: 'i'}})
    }

    // Math
    const totalCount = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).countDocuments();
    const pagesCount = Math.ceil(totalCount / limit);
    const skip = (pageNumber - 1) * limit;

    // GET Data DB
    const blogs = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .find(searchRegex, {limit, skip, sort: {[sortBy]: sortDirection} })
      .toArray();

    // Mapping
    return this._mapWithPagination(pagesCount, pageNumber, limit, blogs.length, blogs.map(this._mapBlogs))
  },
  async getBlogById (id: string): Promise<BlogModel | null> {
    const currentBlog = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).findOne({_id: new ObjectId(id)});
    if(!currentBlog) return null;
    return this._mapBlogs(currentBlog);
  },
  _mapBlogs(blog: WithId<BlogModel> ): BlogModel{
    return {
      id: blog?.id || blog?._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    }
  },
  _mapWithPagination(pagesCount: number, page: number, pageSize: number, totalCount: number, items: Array<BlogModel>): OutputViewModalBlog  {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items
    }
  }
}
