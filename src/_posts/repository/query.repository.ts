import {OutputViewModalPost, PostModel} from '../model/post.model';
import {postsCollection} from '../../DB';
import {ObjectId, WithId} from 'mongodb';
import {mappingQueryParamsBlogsAndPosts, QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';

export const queryPostsRepository = {
  async getAllPosts(query: QueryParamsGet): Promise<OutputViewModalPost> {
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)
    // Math
    const totalCount = await postsCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;

    // GET Data DB
    const posts = await postsCollection
      .find(queries.searchRegex)
      .sort(queries.sortBy, queries.sortDirection)
      .limit(queries.limit)
      .skip(skip)
      .toArray();
    // Mapping
    const items = posts.map(this._mapPosts);
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, items)
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
    const totalCount = await postsCollection.countDocuments({blogId});
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;
    const posts = await postsCollection
      .find({blogId})
      .sort(queries.sortBy, queries.sortDirection)
      .limit(queries.limit)
      .skip(skip)
      .toArray();
    //Mapping
    const items = posts.map(this._mapPosts);
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, items)
  },
  _mapPosts(post: WithId<PostModel>): PostModel{
    return {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      id: (post?.id || post?._id)?.toString(),
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
