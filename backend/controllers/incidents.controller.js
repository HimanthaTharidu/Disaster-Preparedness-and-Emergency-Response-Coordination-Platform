import * as incidentsService from '../services/incidents.service.js';

export async function list(req, res) {
  res.json({ incidents: await incidentsService.listIncidents(res.locals.query) });
}

export async function detail(req, res) {
  res.json({ incident: await incidentsService.getIncident(req.params.id) });
}
