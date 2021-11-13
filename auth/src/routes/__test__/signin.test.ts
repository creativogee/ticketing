import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@tester.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@tester.com',
      password: 'password',
    })
    .expect(200);
});

it('returns a 400 when user does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@tester.com',
      password: 'password',
    })
    .expect(400);
});

it('response with a cookie with valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@tester.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@tester.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('set-cookie')).toBeDefined();
});
