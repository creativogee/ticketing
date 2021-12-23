import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { getAuthCookie } from '../../test/auth';

it('returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if it is found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  const tickets = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

  expect(tickets.body.title).toEqual(title);
  expect(tickets.body.price).toEqual(price);
});
