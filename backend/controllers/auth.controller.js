import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  const { email, password } = req.body;
  res.json(await authService.login(email, password));
}

export function refresh(req, res) {
  res.json(authService.refresh(req.body.refreshToken));
}

export function logout(req, res) {
  authService.logout(req.body.refreshToken);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: authService.toPublicUser(req.user) });
}
