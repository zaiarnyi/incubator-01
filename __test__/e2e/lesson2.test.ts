import request from 'supertest';
import {app} from '../../src';

describe('lesson 2 (/blogs)', ()=> {

  beforeEach(async () => {
    await request(app).delete('/testing/all-data').expect(204);
  });

  it('should be get array blogs (/blogs)', async ()=> {
    await request(app).get('/blogs').expect(200);
  })

  it('should be get blog with id 1', async ()=> {
    const validBlog = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
    }
    const createValid = await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(201)

    await request(app).get('/blogs').expect(200, [createValid.body]);
  })

  it('should be create blog', async ()=> {
    const validBlog = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
    }

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
      .set({ Authorization: "" })
      .send({})
      .expect(400)

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400)

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400)

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog3)
      .expect(400)

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog4)
      .expect(400)

    const createValid = await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(201)

    await request(app).get('/blogs').expect(200, [createValid.body]);

  })

  it('should be remove blog with id 1', async ()=> {
    const validBlog = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
    }
   await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(201, {id: '1', ...validBlog})

    await request(app).delete('/blogs/1').expect(204);
  })

  it('should be update blog', async ()=> {
    const validCreate = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
    }
    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(validCreate)
      .expect(201, {id: '1', ...validCreate})


    const validBlog = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://gitlab.io/typescript-definitive-guide/book/contents/"
    }

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
      .set({ Authorization: "" })
      .send({})
      .expect(400)

    await request(app)
      .put('/blogs/1')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400)

    await request(app)
      .put('/blogs/1')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400)

    await request(app)
      .put('/blogs/1')
      .set({ Authorization: "" })
      .send(invalidBlog3)
      .expect(400)

    await request(app)
      .put('/blogs/1')
      .set({ Authorization: "" })
      .send(invalidBlog4)
      .expect(400)

   await request(app)
      .put('/blogs/1')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(204)

  })
})

describe('lesson 2 (/posts)', ()=> {

  beforeEach(async () => {
    await request(app).delete('/testing/all-data').expect(204);
  });

  it('should be get array products', async ()=> {
    await request(app).get('/posts').expect(200);
  })

  it('should be get post with id 1', async ()=> {
    const validPost = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }
    const createValid = await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(validPost)
      .expect(201)

    await request(app).get('/posts').expect(200, [createValid.body]);
  })

  it('should be create post', async ()=> {
    const validPost = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
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
      "blog": "string"
    }

    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send({})
      .expect(400)

    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(invalidPost1)
      .expect(400)

    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(invalidPost2)
      .expect(400)

    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(invalidPost3)
      .expect(400)


    const createValid = await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(validPost)
      .expect(201)

    await request(app).get('/posts').expect(200, [createValid.body]);

  })

  it('should be remove post with id', async ()=> {
    const validPost = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }
    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(validPost)
      .expect(201, {id: '1', ...validPost})

    await request(app).delete('/posts/1').expect(204);
  })

  it('should be update product', async ()=> {
    const createPost = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }
    await request(app)
      .post('/posts')
      .set({ Authorization: "" })
      .send(createPost)
      .expect(201, {id: '1', ...createPost})


    const validPost = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
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
      "websiteUrl": "dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque"
    };

    await request(app)
      .put('/posts/1')
      .set({ Authorization: "" })
      .send({})
      .expect(400)

    await request(app)
      .put('/posts/1')
      .set({ Authorization: "" })
      .send(invalidPost1)
      .expect(400)

    await request(app)
      .put('/posts/1')
      .set({ Authorization: "" })
      .send(invalidPost2)
      .expect(400)

    await request(app)
      .put('/posts/1')
      .set({ Authorization: "" })
      .send(validPost)
      .expect(204)

  })
})
