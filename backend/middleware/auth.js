import { verifyAccessToken } from '../utils/token.js';
import { findById } from '../repositories/users.repository.js';
import { HttpError } from '../utils/httpError.js';

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Sign in first');
  try {
    const user = findById(verifyAccessToken(token).sub);
    if (!user) throw new Error('unknown user');
    req.user = user;
  } catch {
    throw new HttpError(401, 'Your session has expired. Sign in again');
  }
  next();
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new HttpError(403, 'You do not have access to this');
  next();
};
