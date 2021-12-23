import mongoose from 'mongoose';
import { OrderStatus } from '@gbticket/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models';
import { getAuthCookie } from '../../test/auth';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns 404 if order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie())
    .send({ token: 'asdf', orderId: new mongoose.Types.ObjectId().toHexString() });
});

it('returns 401 when order does not belong to user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie())
    .send({ token: 'asdf', orderId: order.id });
});

it('404 when attempting to purchase cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie(userId))
    .send({ token: 'asdf', orderId: order.id })
    .expect(400);
});

it('return 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
