import * as incidents from '../repositories/incidents.repository.js';
import { HttpError } from '../utils/httpError.js';

export function listIncidents({ status, priority } = {}) {
  return incidents
    .list()
    .filter((i) => (!status || i.status === status) && (!priority || i.priority === priority))
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
}

export function getIncident(id) {
  const incident = incidents.findById(id);
  if (!incident) throw new HttpError(404, 'Incident not found');
  return incident;
}
