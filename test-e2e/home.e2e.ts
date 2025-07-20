import * as request from 'supertest';

const localApp = 'http://localhost:8080';
const localAppName = 'nestjs-start-local';

describe('AppController (e2e)', () => {
  // Make sure that GET root is working and that config data is read correctly
  it('/ (GET)', async () => {
    const root = await request(localApp)
      .get('/')
      .expect(200);

    const regex = new RegExp(`^Welcome to the ${localAppName} app. The time is now`);

    expect(root.body.message).toMatch(regex);
  });

  // Make sure that POST root is working
  it('/ (POST)', async () => {
    const now = '2025-07-20T01:02:03.456Z';
    const root = await request(localApp)
      .post('/')
      .send({ now })
      .expect(201);

    expect(root.body.message).toMatch(new RegExp(`^Welcome to the ${localAppName} app. The time is now ${now}`));
  });

  it('/ (POST) Validation Error', async () => {
    const now = 'not-a-date-FVwwT6hmA7';
    const root = await request(localApp)
      .post('/')
      .send({ now })
      .expect(400);

    expect(root.body.message).toEqual('Validation Exception');
    expect(root.body.payload?.now?.value).toEqual(now);
    expect(root.body.payload?.now?.constraints?.isDateString).toEqual('now must be a valid ISO 8601 date string');
  });
});
