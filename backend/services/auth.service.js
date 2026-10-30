import { findByEmail } from '../repositories/users.repository.js';
import { verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';
import { HttpError } from '../utils/httpError.js';

export const toPublicUser = ({ id, name, email, role }) => ({ id, name, email, role });

export async function login(email, password) {
  const user = findByEmail(email);
  // Same message for an unknown email and a wrong password.
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  return { accessToken: signAccessToken(user), user: toPublicUser(user) };
}
