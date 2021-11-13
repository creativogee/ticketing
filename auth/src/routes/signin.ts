import express, { Request, Response } from 'express';
import { emailValidation, passwordValidation } from '../validations';
import { validateRequest, BadRequestError } from '@gbticket/common';
import { User } from '../models';
import { JwtAdapter, PasswordManager } from '../services';

const router = express.Router();

const validations = [emailValidation, passwordValidation];

router.post(
  '/api/users/signin',
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const passwordMatch = await PasswordManager.compare(user.password, password);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid email or password');
    }

    const jwt = new JwtAdapter(process.env.JWT_KEY!);
    const userJwt = await jwt.encrypt({
      id: user.id,
      email: user.email,
    });

    //save jwt
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  },
);

export { router as signinRouter };
