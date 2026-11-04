import jwt from 'jsonwebtoken';

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return process.env.JWT_SECRET;
};

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, secret(), {
    subject: user.id,
    expiresIn: process.env.JWT_ACCESS_TTL || '15m',
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, secret());
}
