import { listShelters } from '../services/shelters.service.js';

export async function list(req, res) {
  res.json({ shelters: await listShelters() });
}
