import { verifyAccessToken } from '../utils/token.js';
import { findById } from '../repositories/users.repository.js';
import { HttpError } from '../utils/httpError.js';

export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Sign in first');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new HttpError(401, 'Your session has expired. Sign in again');
  }

  const user = await findById(payload.sub);
  if (!user) throw new HttpError(401, 'Your session has expired. Sign in again');
  req.user = user;
  next();
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new HttpError(403, 'You do not have access to this');
  next();
};
