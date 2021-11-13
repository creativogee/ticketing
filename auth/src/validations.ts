import { body } from 'express-validator';

export const emailValidation = body('email').isEmail().withMessage('Email must be valid');

export const passwordValidation = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password cannot be empty')
  .isLength({ min: 4, max: 20 })
  .withMessage('Password must be between 4 and 20 characters');
