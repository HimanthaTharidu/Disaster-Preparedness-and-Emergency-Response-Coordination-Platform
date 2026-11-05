import * as incidents from '../repositories/incidents.repository.js';
import { HttpError } from '../utils/httpError.js';

export async function listIncidents({ status, priority } = {}) {
  return incidents.list({ status, priority });
}

export async function getIncident(id) {
  const incident = await incidents.findById(id);
  if (!incident) throw new HttpError(404, 'Incident not found');
  return incident;
}
