import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/auth';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', getAuthCookie()).send({
    title: 'concert',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket().expect(201);
  await createTicket().expect(201);
  await createTicket().expect(201);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
