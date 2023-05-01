import { createServer } from 'http';
import { type Server } from 'net';

import request from 'supertest';

import app from '../src/server';

describe('Server', () => {
  let httpServer: Server;

  beforeAll((done) => {
    httpServer = createServer(app);
    httpServer.listen(done);
  });

  afterAll((done) => {
    httpServer.close(done);
  });

  describe('GET /messages', () => {
    it('should return messages', async () => {
      const response = await request(app).get('/messages');
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('author');
      expect(response.body[0]).toHaveProperty('text');
      expect(response.body[0]).toHaveProperty('timestamp');
    });
  });

  describe('POST /messages', () => {
    it('should create a new message', async () => {
      const newMessage = {
        text: 'New helpful comment',
        author: 'Val Bu',
        timestamp: Date.now(),
      };

      const response = await request(app)
        .post('/messages')
        .send(newMessage);

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject(newMessage);
    });

    it('should return an error if text or author is missing', async () => {
      const response = await request(app).post('/messages').send({});
      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(2);

      const authorFieldError = response.body.errors.find((err: any) => err.path === 'author');
      expect(authorFieldError).toBeDefined();
      expect(authorFieldError).toMatchObject({
        type: 'field',
        msg: 'Author is required',
        path: 'author',
        location: 'body',
      });

      const textFieldError = response.body.errors.find((err: any) => err.path === 'text');
      expect(textFieldError).toBeDefined();
      expect(textFieldError).toMatchObject({
        type: 'field',
        msg: 'Text is required',
        path: 'text',
        location: 'body',
      });
    });
  });
});