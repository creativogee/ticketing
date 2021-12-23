import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@gbticket/common';
import { titleValidation, priceValidation } from '../validations';
import { Ticket } from '../models';
import { TicketCreatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validations = [titleValidation, priceValidation];

router.post(
  '/api/tickets',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  },
);

export { router as createTicketRouter };
