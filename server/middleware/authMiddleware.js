import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';

/**
 * Protect routes: requires valid JWT in Authorization header
 */
export async function requireAuth(req, res, next) {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The student account associated with this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
      error: error.message
    });
  }
}

/**
 * Optional Auth: attaches req.user if valid token provided, else proceeds as guest
 */
export async function optionalAuth(req, res, next) {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user || null;
  } catch (error) {
    req.user = null;
  }

  next();
}

/**
 * Generate signed JWT token for user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    ENV.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
}
