import { body } from 'express-validator';

export const titleValidation = body('title').not().isEmpty().withMessage('Tile is required');

export const priceValidation = body('price')
  .isFloat({ gt: 0 })
  .withMessage('Price must be greater than 0');
