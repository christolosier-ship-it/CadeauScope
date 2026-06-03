import { APP } from '../config.js';
import { repositories } from '../db/repositories.js';
import { clearDb } from '../db/db.js';
import { seedDefaults } from '../db/seed.js';
import { todayInput, nowIso } from '../utils/dates.js';
import { downloadJson } from '../utils/files.js';
export async function buildExport(){ return { app:APP.name, schemaVersion:1, appVersion:APP.version, exportedAt:nowIso(), people:await repositories.people.all(), ideas:await repositories.ideas.all(), occasions:await repositories.occasions.all(), history:await repositories.history.all(), categories:await repositories.categories.all(), settings:await repositories.settings.get('main') }; }
export async function exportJson(){ const data=await buildExport(); downloadJson(`cadeauscope-sauvegarde-${todayInput()}.json`, data); return data; }
export async function importJson(data){ if(data?.app!==APP.name || data.schemaVersion!==1) throw new Error('Sauvegarde CadeauScope incompatible.'); await clearDb(); const ids={ people:new Set((data.people||[]).map(x=>x.id)), ideas:new Set((data.ideas||[]).map(x=>x.id)), occasions:new Set((data.occasions||[]).map(x=>x.id))}; for(const p of data.people||[]) await repositories.people.put({...p, photoId:''}); for(const c of data.categories||[]) await repositories.categories.put(c); for(const o of data.occasions||[]) await repositories.occasions.put(o); for(const i of data.ideas||[]) await repositories.ideas.put({...i, photoId:'', personId:ids.people.has(i.personId)?i.personId:''}); for(const h of data.history||[]) await repositories.history.put(h); if(data.settings) await repositories.settings.put({...data.settings, exportPhotos:false}); await seedDefaults(); }
