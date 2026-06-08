import { APP } from '../config.js';
import { repositories } from '../db/repositories.js';
import { clearDb } from '../db/db.js';
import { seedDefaults } from '../db/seed.js';
import { todayInput, nowIso } from '../utils/dates.js';
import { downloadJson } from '../utils/files.js';
import { createIdea } from '../models/ideas.model.js';
import { normalizeOccasions } from './occasions.service.js';
export async function buildExport(){ return { app:APP.name, schemaVersion:1, appVersion:APP.version, exportedAt:nowIso(), settings:await repositories.settings.get('main'), people:await repositories.people.all(), categories:await repositories.categories.all(), occasions:await repositories.occasions.all(), ideas:(await repositories.ideas.all()).map(i=>({...i,photoId:''})), history:await repositories.history.all(), photos:[] }; }
export async function exportJson(){ const data=await buildExport(); downloadJson(`cadeauscope-sauvegarde-${todayInput()}.json`, data); return data; }
function importArray(data, key) { const value = data?.[key]; if (value == null) return []; if (!Array.isArray(value)) throw new Error('Sauvegarde CadeauScope invalide.'); return value; }
export async function importJson(data){
  if(data?.app!==APP.name || data.schemaVersion!==1) throw new Error('Sauvegarde CadeauScope incompatible.');
  const people = importArray(data, 'people');
  const categories = importArray(data, 'categories');
  const occasions = importArray(data, 'occasions');
  const ideas = importArray(data, 'ideas');
  const history = importArray(data, 'history');
  if (data.settings != null && (typeof data.settings !== 'object' || Array.isArray(data.settings))) throw new Error('Sauvegarde CadeauScope invalide.');
  const ids={ people:new Set(people.map(x=>x.id)), occasions:new Set(occasions.map(x=>x.id))};
  await clearDb();
  for(const p of people) await repositories.people.put({...p, photoId:''});
  for(const c of categories) await repositories.categories.put(c);
  for(const o of occasions) await repositories.occasions.put(o);
  for(const i of ideas) await repositories.ideas.put(createIdea({...i, photoId:'', personId:ids.people.has(i.personId)?i.personId:'', occasionId:ids.occasions.has(i.occasionId)?i.occasionId:''}));
  for(const h of history) await repositories.history.put(h);
  if(data.settings) await repositories.settings.put({...data.settings, exportPhotos:false});
  await seedDefaults();
  await normalizeOccasions();
}
