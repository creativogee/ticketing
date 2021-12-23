import { body } from 'express-validator';
import mongoose from 'mongoose';

export const ticketIdValidation = body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('TicketId is required');
