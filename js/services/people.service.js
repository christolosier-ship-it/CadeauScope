import { repositories } from '../db/repositories.js';
import { createPerson } from '../models/people.model.js';
import { validatePerson, hasErrors } from './validation.service.js';
import { nowIso } from '../utils/dates.js';
import { syncBirthdayEvents, normalizeOccasions } from './occasions.service.js';
export const listPeople = async (includeArchived=false) => (await repositories.people.all()).filter(p=>includeArchived || !p.archived).sort((a,b)=>a.name.localeCompare(b.name,'fr'));
export const getPerson = id => repositories.people.get(id);
export async function savePerson(data){ const errors=validatePerson(data); if(hasErrors(errors)) throw Object.assign(new Error('Personne invalide'),{errors}); const existing=data.id ? await getPerson(data.id) : null; const item=createPerson({...existing,...data,createdAt:existing?.createdAt}); await repositories.people.put(item); await syncBirthdayEvents(); return item; }
export async function archivePerson(id, archived=true){ const p=await getPerson(id); if(!p) return null; const next={...p,archived,updatedAt:nowIso()}; await repositories.people.put(next); await syncBirthdayEvents(); return next; }
export async function canDeletePerson(id){ const [ideas,history]=await Promise.all([repositories.ideas.all(),repositories.history.all()]); return !ideas.some(i=>i.personId===id) && !history.some(h=>h.personId===id); }
export async function deletePerson(id){ if(!(await canDeletePerson(id))) throw new Error('Suppression bloquée: cette personne a encore des idées ou de l’historique.'); await repositories.people.delete(id); const events=await repositories.occasions.all(); for(const event of events){ if(event.personIds?.includes?.(id)) await repositories.occasions.put({...event, personIds:event.personIds.filter(pid=>pid!==id), updatedAt:nowIso()}); } await normalizeOccasions(); }
