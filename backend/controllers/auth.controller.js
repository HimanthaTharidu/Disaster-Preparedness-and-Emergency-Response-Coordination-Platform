import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  const { email, password } = req.body;
  res.json(await authService.login(email, password));
}

export function me(req, res) {
  res.json({ user: authService.toPublicUser(req.user) });
}
