import { readFileSync } from 'node:fs';

const incidents = JSON.parse(readFileSync(new URL('../data/incidents.json', import.meta.url)));

export const list = () => incidents;
export const findById = (id) => incidents.find((i) => i.id === id);
