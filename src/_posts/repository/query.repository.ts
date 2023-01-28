import {OutputViewModalPost, PostModel} from '../model/post.model';
import {DB, postsCollection} from '../../DB';
import {DB_NAME_COLLECTION_PRODUCTS} from '../../constants';
import {ObjectId, WithId} from 'mongodb';
import {mappingQueryParamsBlogsAndPosts, QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';

export const queryPostsRepository = {
  async getAllPosts(query: QueryParamsGet): Promise<OutputViewModalPost> {
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)
    // Math
    const skip = (queries.pageNumber - 1) * queries.limit;

    // GET Data DB
    const posts = await DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS)
      .find(queries.searchRegex, {limit: queries.limit, skip, sort: queries.sort })
      .toArray();

    // Mapping
    const totalCount = queries.searchNameTerm?.length ? posts?.length : await DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS).countDocuments();
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const items = posts.map(this._mapPosts);
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, posts?.length, items)
  },
  async getPostById (id: string): Promise<PostModel | null> {
    const post = await postsCollection.findOne({_id: new ObjectId(id)});
    if(!post) return null;
    return this._mapPosts(post);
  },
  async getPostsByBlogId(blogId: string, query: QueryParamsGet): Promise<OutputViewModalPost>{
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)
    // Math
    const skip = (queries.pageNumber - 1) * queries.limit;

    const posts = await postsCollection
      .find({blogId, ...queries.searchRegex}, {limit: queries.limit, skip, sort: queries.sort })
      .toArray();

    const totalCount = queries.searchNameTerm?.length ? posts?.length : await DB<PostModel>(DB_NAME_COLLECTION_PRODUCTS).countDocuments();
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const items = posts.map(this._mapPosts);
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, items)
  },
  _mapPosts(post: WithId<PostModel>): PostModel{
    return {
      id: (post?.id || post?._id)?.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    }
  },
  _mapWithPagination(pagesCount: number, page: number, pageSize: number, totalCount: number, items: PostModel[]): OutputViewModalPost {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items
    }
  }
}
