import {BlogModel, OutputViewModalBlog} from '../model/blog.model';
import {DB} from '../../DB';
import {DB_NAME_COLLECTION_BLOG} from '../../constants';
import {ObjectId, WithId} from 'mongodb';
import {mappingQueryParamsBlogsAndPosts, QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';


export const queryBlogsRepository = {
  async getAllBlogs (query: QueryParamsGet): Promise<OutputViewModalBlog> {
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)
    // Math
    const totalCount = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).countDocuments(queries.searchRegex);
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;

    // GET Data DB
    const blogs = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG)
      .find(queries.searchRegex, { sort: queries.sort, limit: queries.limit, skip})
      .toArray();

    // Mapping
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, blogs.map(this._mapBlogs))
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
