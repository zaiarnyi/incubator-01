import request from 'supertest';
import {app, server} from '../../src';
import * as dotenv from 'dotenv';
import {disconnectDB} from '../../src/DB';
import {VideoType} from '../../src/models/VideoModel';
import {AvailableResolutionsEnum} from '../../src/types/video.type';

dotenv.config();

const LOGIN: string = process.env.BASIC_LOGIN || '';
const PASSWORD: string = process.env.BASIC_PASSWORD || '';


const validBlog = {
  "name": "string",
  "description": "string",
  "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
}


describe('Testing', ()=> {
  describe('/video', () => {
    beforeEach(async ()=> {
      await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return 404 for not existing video', async () => {
      await request(app)
        .get('/videos/1')
        .expect(404)
    })

    it('Retrieving an array of data', async () => {
      await request(app)
        .get('/videos')
        .expect(200, [])
    })

    it('Creatures with valid values and get array with video object', async () => {
      const data: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: 'title',
        author: 'author',
        availableResolutions: [AvailableResolutionsEnum.P144]
      };
      const response =  await request(app)
        .post('/videos')
        .send(data)
        .expect(201)

      await request(app)
        .get('/videos')
        .expect(200, [response.body])
    })

    it('Creatures with invalid values', async () => {
      const data: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: 'title',
        author: 'author',
        availableResolutions: ["P143" as AvailableResolutionsEnum]
      };
      const dat1: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: '',
        author: 'author',
        availableResolutions: ["P143" as AvailableResolutionsEnum]
      };
      const data2: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: '',
        author: '',
        availableResolutions: null
      };
      const data3: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: 'asdasdasd asd asd as asd as asd as asd a sda sdasd asd ',
        author: 'asda sd adasdasd asd asd asd as dasd asd asd asd asd asd asd asd a',
        availableResolutions: [AvailableResolutionsEnum.P144]
      };

      await request(app)
        .post('/videos')
        .send(data)
        .expect(400)

      await request(app)
        .post('/videos')
        .send(dat1)
        .expect(400)

      await request(app)
        .post('/videos')
        .send(data2)
        .expect(400)

      await request(app)
        .post('/videos')
        .send(data3)
        .expect(400)
    })

    it('delete all video', async ()=> {
      await request(app).delete('/testing/all-data').expect(204)
    })

    it(`should update video with correct input data`, async () => {
      const data: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: 'title',
        author: 'author',
        availableResolutions: [AvailableResolutionsEnum.P144]
      };
      const dataForUpdate: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
        title: 'title1',
        author: 'author2',
        availableResolutions: [AvailableResolutionsEnum.P144]
      };
      const response =  await request(app)
        .post('/videos')
        .send(data)
        .expect(201)

      const createdVideo = response.body
      await request(app)
        .put(`/videos/${createdVideo?.id}`)
        .send(dataForUpdate)
        .expect(204)

      const updatedVideo = {...createdVideo, ...dataForUpdate};

      await request(app)
        .get('/videos')
        .expect(200, [updatedVideo])
    })
  })
  describe('lesson 2 (/blogs)', () => {
    beforeEach(async () => {
      await request(app).delete('/testing/all-data').expect(204);
    });
    it('should be get array blogs (/blogs)', async () => {
      await request(app).get('/blogs').expect(200, []);
    })

    it('should be get blog with id 1', async () => {
      const createValid = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      await request(app).get('/blogs').expect(200, [createValid.body]);
    })

    it('should be create blog', async () => {
      const invalidBlog1 = {
        "name": 123123123,
        "description": true,
        "websiteUrl": "string"
      };
      const invalidBlog2 = {
        "name": '123123123',
        "description": 'true',
        "websiteUrl": "string"
      };
      const invalidBlog3 = {
        "name": '123123123',
        "websiteUrl": "string"
      };
      const invalidBlog4 = {
        "na": '123123123',
        "description": 'true',
        "websiteUrl": "string"
      };
      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send({})
        .expect(400)

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog1)
        .expect(400)

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog2)
        .expect(400)

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog3)
        .expect(400)

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog4)
        .expect(400)

      const createValid = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      await request(app).get('/blogs').expect(200, [createValid.body]);

    })

    it('should be remove blog with id 1', async () => {
      const createBlog = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
      // .expect(201, {id: '1', createdAt: expect.any(String), ...validBlog})

      expect(createBlog.body).toStrictEqual({id: '1', createdAt: expect.any(String), ...validBlog})

      await request(app)
        .delete('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .expect(204);
    })

    it('should be update blog', async () => {
      const validCreate = {
        "name": "string",
        "description": "string",
        "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
      }
      const createBlog = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validCreate)
      // .expect(201, {id: '1', createdAt: expect.any(String) , ...validCreate})
      expect(createBlog.body).toStrictEqual({id: '1',  createdAt: expect.any(String), ...validCreate})

      const invalidBlog1 = {
        "name": 123123123,
        "description": true,
        "websiteUrl": "string"
      };
      const invalidBlog2 = {
        "name": '123123123',
        "description": 'true',
        "websiteUrl": "string"
      };

      const invalidBlog3 = {
        "name": '123123123',
        "websiteUrl": "string"
      };
      const invalidBlog4 = {
        "na": '123123123',
        "description": 'true',
        "websiteUrl": "string"
      };


      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send({})
        .expect(400)

      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog1)
        .expect(400)

      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog2)
        .expect(400)

      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog3)
        .expect(400)

      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidBlog4)
        .expect(400)

      await request(app)
        .put('/blogs/1')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(204)

    })
  })
  describe('lesson 2 (/posts)', () => {

    beforeEach(async () => {
      await request(app).delete('/testing/all-data').expect(204);
    });

    it('should be get array products', async () => {
      await request(app).get('/posts').expect(200, []);
    })

    it('should be get post with id 1', async () => {
      const invalidPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "123123"
      }
      const validPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "1"
      }

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost)
        .expect(400)

      const createValid = await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(validPost)
        .expect(201)


      await request(app).get('/posts').expect(200, [createValid.body]);
    })

    it('should be create post', async () => {
      const validPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "1"
      }

      const invalidPost1 = {
        "title": 123123,
        "shortDescription": true,
        "content": [],
        "blogId": "string"
      };
      const invalidPost2 = {
        "name": [],
        "description": null,
        "websiteUrl": null
      };
      const invalidPost3 = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blog": "123123"
      }

      await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      await request(app)
        .post('/posts')
        .send({})
        .expect(401)

      await request(app)
        .post('/posts')
        .auth("adm", PASSWORD)
        .send({})
        .expect(401)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send({})
        .expect(400)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send({})
        .expect(400)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost1)
        .expect(400)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost2)
        .expect(400)

      await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost3)
        .expect(400)


      const createValid = await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(validPost)
        .expect(201)

      await request(app).get('/posts').expect(200, [createValid.body]);

    })

    it('should be remove post with id', async () => {
      const validPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "1"
      }

      const blogBody = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      const createPost = await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(validPost)

      expect(createPost.body).toStrictEqual({id: '1', blogName: blogBody.body.name,  createdAt: expect.any(String), ...validPost})

      await request(app)
        .delete('/posts/1')
        .auth(LOGIN, PASSWORD)
        .expect(204)
    })
    it('should be update product', async () => {
      const createPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "1"
      }

      const blogBody = await request(app)
        .post('/blogs')
        .auth(LOGIN, PASSWORD)
        .send(validBlog)
        .expect(201)

      const responsePost = await request(app)
        .post('/posts')
        .auth(LOGIN, PASSWORD)
        .send(createPost)

      expect(responsePost.body).toStrictEqual({id: '1', blogName: blogBody.body.name,  createdAt: expect.any(String), ...createPost})

      await request(app).get('/posts/1').expect(200, responsePost.body);

      const validPost = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "1"
      }

      const invalidPost1 = {
        "title": 123123,
        "shortDescription": true,
        "content": [],
        "blogId": "str123ing"
      };
      const invalidPost2 = {
        "name": [],
        "description": null,
        "websiteUrl": "dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque"
      };

      await request(app)
        .put('/posts/1')
        .send({})
        .expect(401)

      await request(app)
        .put('/posts/1')
        .auth(LOGIN, PASSWORD)
        .send({})
        .expect(400)

      await request(app)
        .put('/posts/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost1)
        .expect(400)

      await request(app)
        .put('/posts/1')
        .auth(LOGIN, PASSWORD)
        .send(invalidPost2)
        .expect(400)

      await request(app)
        .put('/posts/1')
        .auth(LOGIN, PASSWORD)
        .send(validPost)
        .expect(204)
    })
  })
  afterAll((done)=> {
    server?.close();
    disconnectDB();
    done();
  })
})
