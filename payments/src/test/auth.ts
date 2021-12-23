import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getAuthCookie = (id?: string): string[] => {
  // Build a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into json
  const sessionJSON = JSON.stringify(session);

  // Encode JSON into base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return the cookie
  return [`express:sess=${base64}`];
};
