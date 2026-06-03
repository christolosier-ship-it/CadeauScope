import { repositories } from '../db/repositories.js';
import { createOccasion } from '../models/occasions.model.js';
import { validateOccasion, hasErrors } from './validation.service.js';
import { listPeople } from './people.service.js';
import { getSettings } from './settings.service.js';
import { nextBirthday, nextChristmas, isWithin, daysUntil, nowIso } from '../utils/dates.js';
export const listManualOccasions = () => repositories.occasions.all();
export async function saveOccasion(data){ const errors=validateOccasion(data); if(hasErrors(errors)) throw Object.assign(new Error('Occasion invalide'),{errors}); const existing=data.id ? await repositories.occasions.get(data.id) : null; const item=createOccasion({...existing,...data,createdAt:existing?.createdAt}); await repositories.occasions.put(item); return item; }
export async function getOccasion(id){ if(id==='auto_christmas') return christmasOccasion(); if(id?.startsWith('auto_birthday_')) return (await automaticBirthdays(true)).find(o=>o.id===id); return repositories.occasions.get(id); }
export async function christmasOccasion(){ const people=(await listPeople()).filter(p=>p.christmasEnabled).map(p=>p.id); return { id:'auto_christmas', name:'Noël', type:'christmas', date:nextChristmas(), personIds:people, totalBudget:null, personBudgets:{}, notes:'Le radar sent les papillotes.', status:'a_venir', source:'auto', archived:false }; }
export async function automaticBirthdays(force=false){ const settings=await getSettings(); return (await listPeople()).map(p=>({ id:`auto_birthday_${p.id}`, name:`Anniversaire de ${p.name}`, type:'birthday', date:nextBirthday(p), personIds:[p.id], status:'a_venir', source:'auto', archived:false })).filter(o=>o.date && (force || isWithin(o.date, settings.eventWarningDays))); }
export async function listOccasions(filter='a_venir'){ const manual=await listManualOccasions(); const auto=[await christmasOccasion(), ...(await automaticBirthdays())]; let all=[...auto,...manual]; if(filter && filter!=='toutes') all=all.filter(o=>filter==='archivees'?o.archived:o.status===filter); return all.sort((a,b)=>daysUntil(a.date)-daysUntil(b.date)); }
export async function closeOccasion(id){ const o=await repositories.occasions.get(id); if(!o) return null; const next={...o,status:'terminee',updatedAt:nowIso()}; await repositories.occasions.put(next); return next; }
export async function deleteOccasion(id){ const ideas=await repositories.ideas.all(); for(const idea of ideas.filter(i=>i.occasionId===id)){ await repositories.ideas.put({...idea, occasionId:'', occasionMode:'none', updatedAt:nowIso()}); } await repositories.occasions.delete(id); }
