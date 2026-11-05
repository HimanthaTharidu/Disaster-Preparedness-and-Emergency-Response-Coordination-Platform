import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  const { email, password } = req.body;
  res.json(await authService.login(email, password));
}

export async function register(req, res) {
  res.status(201).json(await authService.register(req.body));
}

export async function refresh(req, res) {
  res.json(await authService.refresh(req.body.refreshToken));
}

export async function logout(req, res) {
  await authService.logout(req.body.refreshToken);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: authService.toPublicUser(req.user) });
}
