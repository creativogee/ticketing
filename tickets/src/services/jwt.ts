import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces';

export class JwtAdapter {
  constructor(private readonly secret: string) {}

  async encrypt(payload: IUser, expiry?: string) {
    return jwt.sign(payload, this.secret, { expiresIn: expiry || '30d' });
  }

  async decrypt(ciphertext: string) {
    return jwt.verify(ciphertext, this.secret) as IUser;
  }
}
