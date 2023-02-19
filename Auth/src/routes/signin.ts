import express from 'express';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import  Jwt  from 'jsonwebtoken';


import { ValidateRequest,BadRequestError } from "@mandeezticketing/common/build"
import { User } from '../models/user';
import { Password } from '../services/password';
const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('please supply a password'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('invalid credentials');
    }
    const PasswordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!PasswordsMatch) {
      throw new BadRequestError('invalid credentials');
    }

    const userJWT = Jwt.sign(
      {
        id: existingUser.id,
        email,
      },
      process.env.JWT_KEY!
    );

    // store it on session object
    req.session = {
      jwt: userJWT,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
