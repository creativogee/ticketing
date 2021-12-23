import { body } from 'express-validator';
import mongoose from 'mongoose';

export const tokenValidation = body('token').not().isEmpty();

export const orderIdValidation = body('orderId').not().isEmpty();
