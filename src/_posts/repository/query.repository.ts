import {FullPostModal, OutputViewModalPost, PostModel} from '../model/post.model';
import {postsCollection} from '../../DB';
import {ObjectId} from 'mongodb';
import {mappingQueryParamsBlogsAndPosts, QueryParamsGet} from '../../utils/queryParamsForBlogsAndPosts';
import {LikeStatusPostEntity} from '../model/likePostStatuse.entity';
import {LikeStatus, LikeStatusCommentsEntity} from '../../_comments/entity/likesStatusComments.entity';

export class QueryPostsRepository {
  async getAllPosts(query: QueryParamsGet, userId: string): Promise<OutputViewModalPost> {
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query);
    // Math
    const totalCount = await postsCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;

    // GET Data DB
    const posts = await postsCollection
      .find(queries.searchRegex, {projection:
          {"id": "$_id",
            _id: 0,
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName:1,
            createdAt: 1
          }})
      .sort(queries.sortBy, queries.sortDirection)
      .limit(queries.limit)
      .skip(skip)
      .toArray();
    // Mapping
    const postAndLikes = await this.postWithLikesInfo(posts, userId);


    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, postAndLikes)
  }
  async getPostById (id: string): Promise<PostModel | null> {
    const post: PostModel | null = await postsCollection
      .findOne({_id: new ObjectId(id)},
        {projection:
            {"id": "$_id",
              _id: 0,
              title: 1,
              shortDescription: 1,
              content: 1,
              blogId: 1,
              blogName:1,
              createdAt: 1
            }})
    if (!post) return null;
    return post
  }
  async getPostsByBlogId(blogId: string, query: QueryParamsGet): Promise<OutputViewModalPost>{
    //Read Query Params
    const queries = mappingQueryParamsBlogsAndPosts(query)

    // Math
    const totalCount = await postsCollection.countDocuments({blogId});
    const pagesCount = Math.ceil(totalCount / queries.limit);
    const skip = (queries.pageNumber - 1) * queries.limit;
    const posts = await postsCollection
      .find({blogId}, {projection: {"id": "$_id",
          _id: 0,
          title: 1,
          shortDescription: 1,
          content: 1,
          blogId: 1,
          blogName:1,
          createdAt: 1
        }})
      .sort(queries.sortBy, queries.sortDirection)
      .limit(queries.limit)
      .skip(skip)
      .toArray();

    //Mapping
    const postAndLikes = await this.postWithLikesInfo(posts, '');
    return this._mapWithPagination(pagesCount, queries.pageNumber, queries.limit, totalCount, postAndLikes)
  }
  async postWithLikesInfo(posts: PostModel[], userId: string){
    let extendedLikesInfo = {};
    // @ts-ignore
    extendedLikesInfo.likesCount = await LikeStatusCommentsEntity.find({like: true}).count() || 0;
    // @ts-ignore
    extendedLikesInfo.dislikesCount = await LikeStatusCommentsEntity.find({dislike: true}).count() || 0;


    return Promise.all(posts.map(async (item) => {
      const userInfoLikes = await LikeStatusCommentsEntity.find({userId, _id: new ObjectId(item.id)});
      // @ts-ignore
      extendedLikesInfo.myStatus = userInfoLikes.length ? userInfoLikes.myStatus : LikeStatus.None;
      // @ts-ignore
      extendedLikesInfo.newestLikes = await LikeStatusCommentsEntity.findById(item.id).sort({addedAt: -1}).limit(3) || [];
      return {
        ...item,
        extendedLikesInfo
      }
    }));
  }
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
