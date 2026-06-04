import { repositories } from '../db/repositories.js';
import { createIdea } from '../models/ideas.model.js';
import { validateIdea, hasErrors } from './validation.service.js';
import { historyFromIdea } from './history.service.js';
import { getOccasion } from './occasions.service.js';
import { confirmDialog } from '../ui/modals.js';
import { nowIso } from '../utils/dates.js';
export const listIdeas = () => repositories.ideas.all();
export const getIdea = id => repositories.ideas.get(id);
export async function saveIdea(data){ const errors=validateIdea(data); if(hasErrors(errors)) throw Object.assign(new Error('Idée invalide'),{errors}); const existing=data.id ? await getIdea(data.id) : null; const item=createIdea({...existing,...data,createdAt:existing?.createdAt}); await repositories.ideas.put(item); return item; }
export async function duplicateIdea(id){ const idea=await getIdea(id); const copy=createIdea({...idea,id:undefined,status:'idee',boughtAt:'',wrappedAt:'',offeredAt:'',createdAt:undefined}); await repositories.ideas.put(copy); return copy; }
export async function updateStatus(id,status){ return applyStatus(id,status); }
async function applyStatus(id,status){ const idea=await getIdea(id); if(!idea) return null; const stamp={ achete:'boughtAt', emballe:'wrappedAt', offert:'offeredAt' }[status]; const now=nowIso(); const next={...idea,status,updatedAt:now}; if(stamp && !next[stamp]) next[stamp]=now; await repositories.ideas.put(next); return next; }
export async function requestIdeaStatusChange(id,nextStatus){ const idea=await getIdea(id); if(!idea) return null; if(nextStatus==='offert'){
  if(idea.status==='offert') return idea;
  const ok=await confirmDialog({message:'Marquer cette idée comme offerte et l’ajouter à l’historique ?',confirmText:'Oui, marquer offert'});
  if(!ok) return null;
  const next=await applyStatus(id,'offert');
  await historyFromIdea(next, next.occasionId?await getOccasion(next.occasionId):null);
  return next;
 }
 return applyStatus(id,nextStatus);
}
export async function abandonIdea(id){ return requestIdeaStatusChange(id,'abandonne'); }
export async function deleteIdea(id){ await repositories.ideas.delete(id); }
export async function ideasForPerson(personId){ return (await listIdeas()).filter(i=>i.personId===personId); }
