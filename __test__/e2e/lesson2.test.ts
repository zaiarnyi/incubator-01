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

    await request(app).get('/blogs').expect(200, createValid);
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
    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send({})
      .expect(400, {errors: []})

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400, {errors: []})

    await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400, {errors: []})


    const createValid = await request(app)
      .post('/blogs')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(201)

    await request(app).get('/blogs').expect(200, [createValid]);

  })

  it('should be remove all blogs (/blogs)', async ()=> {
    await request(app).delete('/blogs').expect(204);
  })

  it('should be update blog', async ()=> {
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

    await request(app)
      .put('/blogs')
      .set({ Authorization: "" })
      .send({})
      .expect(400, {errors: []})

    await request(app)
      .put('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400, {errors: []})

    await request(app)
      .put('/blogs')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400, {errors: []})

   await request(app)
      .put('/blogs')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(204)

  })
})

describe('lesson 2 (/products)', ()=> {

  beforeEach(async () => {
    await request(app).delete('/lesson2/testing/all-data').expect(204);
  });

  it('should be get array products', async ()=> {
    await request(app).get('/products').expect(200);
  })

  it('should be get product with id 1', async ()=> {
    const validBlog = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }
    const createValid = await request(app)
      .post('/products/1')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(200)

    await request(app).get('/products').expect(200, createValid);
  })

  it('should be create product', async ()=> {
    const validBlog = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }

    const invalidBlog1 = {
      "title": 123123,
      "shortDescription": true,
      "content": [],
      "blogId": "string"
    };
    const invalidBlog2 = {
      "name": [],
      "description": null,
      "websiteUrl": null
    };
    await request(app)
      .post('/products')
      .set({ Authorization: "" })
      .send({})
      .expect(400, {errors: []})

    await request(app)
      .post('/products')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400, {errors: []})

    await request(app)
      .post('/products')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400, {errors: []})


    const createValid = await request(app)
      .post('/products')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(201)

    await request(app).get('/products').expect(200, [createValid]);

  })

  it('should be remove all products', async ()=> {
    await request(app).delete('/products').expect(204);
  })

  it('should be update product', async ()=> {
    const validBlog = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "string"
    }

    const invalidBlog1 = {
      "title": 123123,
      "shortDescription": true,
      "content": [],
      "blogId": "string"
    };
    const invalidBlog2 = {
      "name": [],
      "description": null,
      "websiteUrl": "dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque"
    };

    await request(app)
      .put('/products')
      .set({ Authorization: "" })
      .send({})
      .expect(400, {errors: []})

    await request(app)
      .put('/products')
      .set({ Authorization: "" })
      .send(invalidBlog1)
      .expect(400, {errors: []})

    await request(app)
      .put('/products')
      .set({ Authorization: "" })
      .send(invalidBlog2)
      .expect(400, {errors: []})

    await request(app)
      .put('/products')
      .set({ Authorization: "" })
      .send(validBlog)
      .expect(204)

  })
})
