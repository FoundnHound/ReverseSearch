const request = require('supertest');
const app = require('../server.js'); // Adjust the path as necessary

describe('API Endpoints', () => {
    it('POST /api/meansLike returns array of words', async () => {
        const res = await request(app)
          .post('/api/meansLike')
          .send({ text: 'ringing in the ears' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('result');
        expect(Array.isArray(res.body.result)).toBe(true);
  });
  it('POST  returns definition', async () => {
      const res = await request(app)
        .post('/api/defineWord')
        .send({ word: 'tinnitus' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('definition');
  });
  it('GET /api/wordOfTheDay returns word of the day', async () => {
      const res = await request(app)
        .get('/api/wordOfTheDay');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('word');
  });
  it('POST /api/soundsLike returns array of words', async () => {
        const res = await request(app)
          .post('/api/soundsLike')
          .send({ text: 'jiraffe' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('result');
        expect(Array.isArray(res.body.result)).toBe(true);
  });
  it('POST /api/adjectiveThatDescribes returns array of words', async () => {
        const res = await request(app)
          .post('/api/adjectiveThatDescribes')
          .send({ text: 'ocean' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('result');
        expect(Array.isArray(res.body.result)).toBe(true);
  });
  it('POST /api/nounsThatAreDescribedBy returns array of words', async () => {
        const res = await request(app)
          .post('/api/nounsThatAreDescribedBy')
          .send({ text: 'green' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('result');
        expect(Array.isArray(res.body.result)).toBe(true);
  });
});