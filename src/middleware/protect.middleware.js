'use strict';

// Import packages
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// Import modules
import APIError from '../apiError.js';
import model from '../models/index.js';

export async function protect(req, res, next) {
  try {
    let token;
    // Check if there's a token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req?.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) throw new APIError('Please log in', 401, true);

    // Verify the token
    const { data: decoded } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user available
    const [user_id, email] = decoded.split('|');
    const user = await model.User.findByPk(parseInt(user_id));
    if (!user) {
      throw new APIError('User belonging to this token is not available', 401, true);
    }

    // Grant access
    req.user = user.toJSON();
    next();
  } catch (error) {
    return next(new APIError(error.message, error.statusCode || 401, true));
  }
}

// Send token to client
export function sendToken(data, res) {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  return res.status(200).json({
    token,
    success: true,
  });
}
