import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@gbticket/common';
import {
  createTicketRouter,
  showTicketRouter,
  allTicketRouter,
  updateTicketRouter,
} from './routes';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
  }),
);

app.use(currentUser);

app.use(createTicketRouter, showTicketRouter, allTicketRouter, updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
