import { repositories } from '../db/repositories.js';
import { createIdea } from '../models/ideas.model.js';
import { validateIdea, hasErrors } from './validation.service.js';
import { nowIso } from '../utils/dates.js';
export const listIdeas = () => repositories.ideas.all();
export const getIdea = id => repositories.ideas.get(id);
export async function saveIdea(data){ const errors=validateIdea(data); if(hasErrors(errors)) throw Object.assign(new Error('Idée invalide'),{errors}); const existing=data.id ? await getIdea(data.id) : null; const item=createIdea({...existing,...data,createdAt:existing?.createdAt}); await repositories.ideas.put(item); return item; }
export async function duplicateIdea(id){ const idea=await getIdea(id); const copy=createIdea({...idea,id:undefined,status:'idee',boughtAt:'',wrappedAt:'',offeredAt:'',createdAt:undefined}); await repositories.ideas.put(copy); return copy; }
export async function updateStatus(id,status){ const idea=await getIdea(id); if(!idea) return null; const stamp={ achete:'boughtAt', emballe:'wrappedAt', offert:'offeredAt' }[status]; const next={...idea,status,updatedAt:nowIso()}; if(stamp && !next[stamp]) next[stamp]=nowIso(); await repositories.ideas.put(next); return next; }
export async function abandonIdea(id){ return updateStatus(id,'abandonne'); }
export async function deleteIdea(id){ await repositories.ideas.delete(id); }
export async function ideasForPerson(personId){ return (await listIdeas()).filter(i=>i.personId===personId); }
