import { findByEmail, findById } from '../repositories/users.repository.js';
import * as refreshTokens from '../repositories/refreshTokens.repository.js';
import { verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';
import { HttpError } from '../utils/httpError.js';

export const toPublicUser = ({ id, name, email, role }) => ({ id, name, email, role });

const issueTokens = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: refreshTokens.create(user.id),
  user: toPublicUser(user),
});

export async function login(email, password) {
  const user = findByEmail(email);
  // Same message for an unknown email and a wrong password.
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  return issueTokens(user);
}

export function refresh(refreshToken) {
  const userId = refreshTokens.consume(refreshToken);
  const user = userId && findById(userId);
  if (!user) throw new HttpError(401, 'Your session has expired. Sign in again');
  return issueTokens(user);
}

export const logout = (refreshToken) => refreshTokens.revoke(refreshToken);
