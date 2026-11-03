import * as incidentsService from '../services/incidents.service.js';

export function list(req, res) {
  res.json({ incidents: incidentsService.listIncidents(res.locals.query) });
}

export function detail(req, res) {
  res.json({ incident: incidentsService.getIncident(req.params.id) });
}
