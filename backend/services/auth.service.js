import {
  findByEmail,
  findById,
  create as createUser,
} from '../repositories/users.repository.js';
import * as refreshTokens from '../repositories/refreshTokens.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';
import { HttpError } from '../utils/httpError.js';

export const toPublicUser = ({ id, name, email, role, phoneNumber }) => ({
  id,
  name,
  email,
  phoneNumber,
  role,
});

async function issueTokens(user) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: await refreshTokens.create(user.id),
    user: toPublicUser(user),
  };
}

export async function login(email, password) {
  const user = await findByEmail(email);
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  return issueTokens(user);
}

export async function register({ name, email, phoneNumber, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (await findByEmail(normalizedEmail)) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  try {
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber?.trim() || null,
      passwordHash: await hashPassword(password),
      role: 'field',
    });
    return issueTokens(user);
  } catch (error) {
    if (error?.code === 'P2002') {
      throw new HttpError(409, 'An account with this email already exists');
    }
    throw error;
  }
}

export async function refresh(refreshToken) {
  const userId = await refreshTokens.consume(refreshToken);
  const user = userId ? await findById(userId) : undefined;
  if (!user) throw new HttpError(401, 'Your session has expired. Sign in again');
  return issueTokens(user);
}

export async function logout(refreshToken) {
  return refreshTokens.revoke(refreshToken);
}
