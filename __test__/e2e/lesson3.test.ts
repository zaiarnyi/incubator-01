// import request from 'supertest';
// import {app, server} from '../../src';
// import * as dotenv from 'dotenv';
// import {disconnectDB} from '../../src/DB';
//
// dotenv.config();
//
// const LOGIN: string = process.env.BASIC_LOGIN || '';
// const PASSWORD: string = process.env.BASIC_PASSWORD || '';
//
//
// const validBlogReq = {
//   "name": "string",
//   "description": "string",
//   "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
// }
//
// const validPostReq = {
//   "title": "string",
//   "shortDescription": "string",
//   "content": "string",
// }
//
// describe('Lesson 3', ()=> {
//   describe('/_blogs', () => {
//     beforeEach(async () => {
//       await request(app).delete('/testing/all-data').expect(204);
//     });
//     it('should be get array blogs', async () => {
//       await request(app).get('/blogs').expect(200, []);
//     })
//
//     it('should be get blog with ObjectId', async () => {
//       const createValid = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       await request(app).get('/blogs').expect(200, {pageCount: 1, page: 1, pageSize: 10});
//     })
//
//     it('should be create blog', async () => {
//       const invalidBlog1 = {
//         "name": 123123123,
//         "description": true,
//         "websiteUrl": "string"
//       };
//       const invalidBlog2 = {
//         "name": '123123123',
//         "description": 'true',
//         "websiteUrl": "string"
//       };
//       const invalidBlog3 = {
//         "name": '123123123',
//         "websiteUrl": "string"
//       };
//       const invalidBlog4 = {
//         "na": '123123123',
//         "description": 'true',
//         "websiteUrl": "string"
//       };
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send({})
//         .expect(400)
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog1)
//         .expect(400)
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog2)
//         .expect(400)
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog3)
//         .expect(400)
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog4)
//         .expect(400)
//
//       const createValid = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       await request(app).get('/blogs').expect(200, [createValid.body]);
//
//     })
//
//     it('should be remove blog with id 1', async () => {
//       const createBlog = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//
//       expect(createBlog.body).toStrictEqual({id: createBlog.body.id, createdAt: expect.any(String), ...validBlogReq})
//
//       await request(app)
//         .delete(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .expect(204);
//     })
//
//     it('should be update blog', async () => {
//       const validCreate = {
//         "name": "string",
//         "description": "string",
//         "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
//       }
//       const createBlog = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validCreate)
//
//       expect(createBlog.body).toStrictEqual({id: createBlog.body.id, createdAt: expect.any(String), ...validCreate})
//
//       const invalidBlog1 = {
//         "name": 123123123,
//         "description": true,
//         "websiteUrl": "string"
//       };
//       const invalidBlog2 = {
//         "name": '123123123',
//         "description": 'true',
//         "websiteUrl": "string"
//       };
//
//       const invalidBlog3 = {
//         "name": '123123123',
//         "websiteUrl": "string"
//       };
//       const invalidBlog4 = {
//         "na": '123123123',
//         "description": 'true',
//         "websiteUrl": "string"
//       };
//
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send({})
//         .expect(400)
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog1)
//         .expect(400)
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog2)
//         .expect(400)
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog3)
//         .expect(400)
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidBlog4)
//         .expect(400)
//
//       await request(app)
//         .put(`/blogs/${createBlog.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(204)
//
//     })
//
//     it('should get all the posts from the blog', async ()=> {
//       const responseCreateBlog = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201);
//
//       const responseCreatePost = await request(app)
//         .post(`/blogs/${responseCreateBlog.body.blogId}/posts`)
//         .auth(LOGIN, PASSWORD)
//         .send(validPostReq)
//
//       expect(responseCreatePost.body).toStrictEqual({...responseCreatePost.body, blogName: })
//
//       // const createPost
//     })
//   })
//   describe('/_posts', () => {
//
//     beforeEach(async () => {
//       await request(app).delete('/testing/all-data').expect(204);
//     });
//
//     it('should be get array products', async () => {
//       await request(app).get('/posts').expect(200, []);
//     })
//
//     it('should be get post with ObjectId', async () => {
//       const createBlog = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//
//       const invalidPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//       }
//       const validPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": createBlog.body.id
//       }
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost)
//         .expect(400)
//
//       const createValid = await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(validPost)
//         .expect(201)
//
//       const response = await request(app).get(`/posts/${createValid.body.id}`);
//       expect(response.body).toStrictEqual(createValid.body)
//     })
//
//     it('should be create post', async () => {
//       const createBlog = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//
//       const validPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": createBlog.body.id
//       }
//
//       const invalidPost1 = {
//         "title": 123123,
//         "shortDescription": true,
//         "content": [],
//         "blogId": "string"
//       };
//       const invalidPost2 = {
//         "name": [],
//         "description": null,
//         "websiteUrl": null
//       };
//       const invalidPost3 = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blog": "123123"
//       }
//
//       await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       await request(app)
//         .post('/posts')
//         .send({})
//         .expect(401)
//
//       await request(app)
//         .post('/posts')
//         .auth("adm", PASSWORD)
//         .send({})
//         .expect(401)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send({})
//         .expect(400)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send({})
//         .expect(400)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost1)
//         .expect(400)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost2)
//         .expect(400)
//
//       await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost3)
//         .expect(400)
//
//
//       const createValid = await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(validPost)
//         .expect(201)
//
//       await request(app).get('/posts').expect(200, [createValid.body]);
//
//     })
//
//     it('should be remove post with id', async () => {
//       const blogBody = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       const validPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": blogBody.body.id
//       }
//
//       const createPost = await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(validPost)
//
//       expect(createPost.body).toStrictEqual({id: createPost.body.id, blogName: blogBody.body.name,  createdAt: expect.any(String), ...validPost})
//
//       await request(app)
//         .delete(`/posts/${createPost.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .expect(204)
//     })
//     it('should be update product', async () => {
//       const blogBody = await request(app)
//         .post('/blogs')
//         .auth(LOGIN, PASSWORD)
//         .send(validBlogReq)
//         .expect(201)
//
//       const createPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": blogBody.body.id
//       }
//
//       const responsePost = await request(app)
//         .post('/posts')
//         .auth(LOGIN, PASSWORD)
//         .send(createPost)
//
//       expect(responsePost.body).toStrictEqual({id: responsePost.body.id, blogName: blogBody.body.name,  createdAt: expect.any(String), ...createPost})
//
//       await request(app).get(`/posts/${responsePost.body.id}`).expect(200, responsePost.body);
//
//       const validPost = {
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": blogBody.body.id
//       }
//
//       const invalidPost1 = {
//         "title": 123123,
//         "shortDescription": true,
//         "content": [],
//         "blogId": "str123ing"
//       };
//       const invalidPost2 = {
//         "name": [],
//         "description": null,
//         "websiteUrl": "dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque"
//       };
//
//       await request(app)
//         .put(`/posts/${responsePost.body.id}`)
//         .send({})
//         .expect(401)
//
//       await request(app)
//         .put(`/posts/${responsePost.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send({})
//         .expect(400)
//
//       await request(app)
//         .put(`/posts/${responsePost.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost1)
//         .expect(400)
//
//       await request(app)
//         .put(`/posts/${responsePost.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(invalidPost2)
//         .expect(400)
//
//       await request(app)
//         .put(`/posts/${responsePost.body.id}`)
//         .auth(LOGIN, PASSWORD)
//         .send(validPost)
//         .expect(204)
//     })
//   })
//   afterAll((done)=> {
//     server?.close();
//     disconnectDB();
//     done();
//   })
// })
