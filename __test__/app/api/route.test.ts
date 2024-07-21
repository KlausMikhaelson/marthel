import request from 'supertest';
import { Server, createServer } from 'http';
import { POST } from '@/app/api/route';

const createTestServer = (handler: any) => {
  return createServer((req, res) => {
    handler(req, res);
  });
};

describe('POST /api/', () => {
  let server: Server;
  let address;

  beforeAll((done) => {
    server = createTestServer(POST);
    server.listen(0, () => {
      address = server.address();
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return correct and feedback for valid input', async () => {
    const response = await request(server)
      .post('/api/')
      .set('stringified', '5+050')
      .set('chosenNumber', '100');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correct: true,
      feedback: ['correct', 'correct', 'correct', 'correct', 'correct', 'correct'],
    });
  });

  it('should return correct: false and feedback for incorrect input', async () => {
    const response = await request(server)
      .post('/api/')
      .set('stringified', '5+040')
      .set('chosenNumber', '100');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correct: false,
      feedback: ['correct', 'correct', 'correct', 'correct', 'wrong-position', 'incorrect'],
    });
  });

  it('should return correct: false and feedback when chosenNumber is missing', async () => {
    const response = await request(server)
      .post('/api/')
      .set('stringified', '5+050');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correct: false,
      feedback: [],
    });
  });

  it('should return correct: false and feedback when equation is missing', async () => {
    const response = await request(server)
      .post('/api/')
      .set('chosenNumber', '100');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correct: false,
      feedback: [],
    });
  });
});
