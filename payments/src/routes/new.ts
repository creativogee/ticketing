import express, { Request, Response } from 'express';
import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
  OrderStatus,
} from '@gbticket/common';
import { Order } from '../models';
import { stripe } from '../stripe';
import { orderIdValidation, tokenValidation } from '../validations';

const router = express.Router();

const validations = [tokenValidation, orderIdValidation];

router.post(
  '/api/payments',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Order is already cancelled');

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.status(201).send({ success: true });
  },
);

export { router as createChargeRouter };
