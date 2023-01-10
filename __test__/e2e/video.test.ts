import request from "supertest";
import { app, server } from '../../src'

describe('/video', () => {

  it('delete all video', async ()=> {
    await request(app).delete('/testing/all-data').expect(204)
  })

  server.close();
})
