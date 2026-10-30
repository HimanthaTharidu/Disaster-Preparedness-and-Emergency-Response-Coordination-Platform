import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  const { email, password } = req.body;
  res.json(await authService.login(email, password));
}
