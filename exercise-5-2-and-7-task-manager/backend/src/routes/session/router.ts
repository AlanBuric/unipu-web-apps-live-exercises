import { Request, Response, Router } from 'express';
import { body, matchedData } from 'express-validator';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import ms, { StringValue } from 'ms';
import getDatabase from '../../database/driver.js';
import handleValidationResult from '../../middleware/validation.js';
import RequestError from '../../util/RequestError.js';
import { StatusCodes } from 'http-status-codes';
import { UserCredentialsRequest } from '../../types/data-transfer-objects.js';

const SessionRouter = () => {
  const { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_TIME } = process.env;

  if (!JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in the environment variables');
  } else if (!JWT_ACCESS_TOKEN_TIME) {
    throw new Error('JWT_ACCESS_TOKEN_TIME is not defined in the environment variables');
  }

  const accessTokenTime = ms(JWT_ACCESS_TOKEN_TIME as StringValue) / 1000;

  return Router()
    .post(
      '/register',
      body('username').notEmpty().trim().withMessage('Username is required'),
      body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
      handleValidationResult,
      async (request: Request<UserCredentialsRequest>, response: Response): Promise<any> => {
        const { username, password } = matchedData<UserCredentialsRequest>(request);
        const usersCollection = getDatabase().collection('users');
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
          return response.status(StatusCodes.CONFLICT).send('Username is already taken');
        }

        const hashedPassword = await argon2.hash(password);
        const result = await usersCollection.insertOne({ username, hashedPassword });

        if (result.acknowledged) {
          return response.status(StatusCodes.CREATED).send('User registered successfully');
        }

        throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, 'User registration failed');
      }
    )
    .post(
      '/login',
      body('username').notEmpty().withMessage('Username is required').isString().trim(),
      body('password').notEmpty().withMessage('Password is required').isString(),
      handleValidationResult,
      async (
        request: Request<object, UserCredentialsRequest>,
        response: Response
      ): Promise<any> => {
        const { username, password } = matchedData<UserCredentialsRequest>(request);
        const usersCollection = getDatabase().collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user || !(await argon2.verify(user.hashedPassword, password))) {
          return response.status(StatusCodes.UNAUTHORIZED).send('Invalid username or password');
        }

        const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_ACCESS_TOKEN_SECRET, {
          expiresIn: accessTokenTime,
        });

        response.status(StatusCodes.OK).send({ accessToken });
      }
    )
    .delete(
      '/account',
      body('username').notEmpty().withMessage('Username is required').isString().trim(),
      body('password').notEmpty().withMessage('Password is required').isString(),
      handleValidationResult,
      async (request: Request, response: Response): Promise<any> => {
        const { username, password } = matchedData<UserCredentialsRequest>(request);
        const usersCollection = getDatabase().collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user || !(await argon2.verify(user.hashedPassword, password))) {
          return response.status(StatusCodes.UNAUTHORIZED).send('Invalid username or password');
        }

        const result = await usersCollection.deleteOne({ _id: new ObjectId(user._id) });

        if (result.deletedCount) {
          return response.status(StatusCodes.OK).send('Account deleted successfully');
        }

        throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete account');
      }
    );
};

export default SessionRouter;
