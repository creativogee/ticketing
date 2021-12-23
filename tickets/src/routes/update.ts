import express, { Request, Response } from 'express';
import { titleValidation, priceValidation } from '../validations';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@gbticket/common';
import { Ticket } from '../models';
import { TicketUpdatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validations = [titleValidation, priceValidation];

router.put(
  '/api/tickets/:id',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.orderId) throw new BadRequestError('Ticket is reserved');

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  },
);

export { router as updateTicketRouter };
