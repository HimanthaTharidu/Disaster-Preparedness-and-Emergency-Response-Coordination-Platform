import bcrypt from 'bcrypt';

export function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(hash, plain) {
  return bcrypt.compare(plain, hash);
}
