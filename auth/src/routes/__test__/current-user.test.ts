import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/auth';

it('response with current user details', async () => {
  const cookie = await getAuthCookie();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null for unauthenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').send().expect(200);
  expect(response.body.currentUser).toBeNull();
});
