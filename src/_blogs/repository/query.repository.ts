import {BlogModel, OutputViewModalBlog} from '../model/blog.model';
import {blogsCollection} from '../../DB';
import {ObjectId, WithId} from 'mongodb';
import {mappingQueryParamsBlogsAndPosts, QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';


export const queryBlogsRepository = {
  async getAllBlogs (query: QueryParamsGet): Promise<OutputViewModalBlog> {
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)
    // Math
    const totalCount = await blogsCollection.countDocuments(queries.searchRegex);
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;

    // GET Data DB
    const blogs = await blogsCollection
      // .find(queries.searchRegex, { sort: queries.sort, limit: queries.limit, skip})
      .find(queries.searchRegex)
      .sort(queries.sortBy, queries.sortDirection)
      .limit(queries.limit)
      .skip(skip)
      .toArray();

    // Mapping
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, blogs.map(this._mapBlogs))
  },
  async getBlogById (id: string): Promise<BlogModel | null> {
    const currentBlog = await blogsCollection.findOne({_id: new ObjectId(id)});
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
