import request from "supertest";
import { app, server } from '../../src'
import {VideoType} from '../../src/models/VideoModel';
import {AvailableResolutionsEnum} from '../../src/types/video.type';
import {route} from '../../src/utils/pathRoute';

describe('/video', () => {

  it('delete all video', async ()=> {
    await request(app).delete('/testing/all-dat').expect(204)
  })

  it('Retrieving an array of data', async () => {
    await request(app)
      .get(route + 'videos')
      .expect(200, [])
  })

  it('Creatures with valid values', async () => {
    const data: Pick<VideoType, "title" | "author" | "availableResolutions"> = {
      title: 'title',
      author: 'author',
      availableResolutions: [AvailableResolutionsEnum.P144]
    };
    await request(app)
      .post(route + 'videos')
      .send(data)
      .expect(201)
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
      .post(route + 'videos')
      .send(data)
      .expect(400)

    await request(app)
      .post(route + 'videos')
      .send(dat1)
      .expect(400)

    await request(app)
      .post(route + 'videos')
      .send(data2)
      .expect(400)

    await request(app)
      .post(route + 'videos')
      .send(data3)
      .expect(400)
  })

  server.close();
})
