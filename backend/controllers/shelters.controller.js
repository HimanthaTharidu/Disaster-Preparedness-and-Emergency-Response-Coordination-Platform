import { listShelters } from '../services/shelters.service.js';

export function list(req, res) {
  res.json({ shelters: listShelters() });
}
