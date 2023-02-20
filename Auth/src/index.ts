import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { errorHandler, NotFound } from '@mandeezticketing/common/build';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('/*', () => {
  throw new NotFound();
});
app.use(errorHandler);

const StartUp = async () => {
  console.log("starting ....")
  if (!process.env.JWT_KEY) {
    throw new Error('environment virable is not defined');
  }
  if (!process.env.MangoUrl) {
    throw new Error('environment virable is not defined');
  }
  try {
    await mongoose.connect(process.env.MangoUrl);
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

StartUp();
