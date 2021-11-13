import express, { Request, Response } from 'express';
import { emailValidation, passwordValidation } from '../validations';
import { validateRequest, BadRequestError } from '@gbticket/common';
import { User } from '../models/user';
import { JwtAdapter } from '../services';

const router = express.Router();

const validations = [emailValidation, passwordValidation];

router.post(
  '/api/users/signup',
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate jwt
    const jwt = new JwtAdapter(process.env.JWT_KEY!);
    const userJwt = await jwt.encrypt({
      id: user.id,
      email: user.email,
    });

    //save jwt
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signupRouter };
