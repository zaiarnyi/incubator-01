import request from "supertest";
import { app, server } from '../../src'
import {VideoType} from '../../src/models/VideoModel';
import {AvailableResolutionsEnum} from '../../src/types/video.type';

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

  server.close();
})
