import { readFileSync } from 'node:fs';

const shelters = JSON.parse(readFileSync(new URL('../data/shelters.json', import.meta.url)));

export const list = () => shelters;
