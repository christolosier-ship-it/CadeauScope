import { repositories } from '../db/repositories.js';
import { createIdea, isIdeaOffered, normalizeIdeaStatus } from '../models/ideas.model.js';
import { validateIdea, hasErrors } from './validation.service.js';
import { historyFromIdea } from './history.service.js';
import { confirmDialog } from '../ui/modals.js';
import { nowIso } from '../utils/dates.js';
export const listIdeas = () => repositories.ideas.all();
export const getIdea = id => repositories.ideas.get(id);
export async function saveIdea(data){ const errors=validateIdea(data); if(hasErrors(errors)) throw Object.assign(new Error('Idée invalide'),{errors}); const existing=data.id ? await getIdea(data.id) : null; const item=createIdea({...existing,...data,createdAt:existing?.createdAt}); await repositories.ideas.put(item); return item; }
export async function duplicateIdea(id){ const idea=await getIdea(id); const copy=createIdea({...idea,id:undefined,status:'idee',occasionMode:'none',occasionId:'',boughtAt:'',wrappedAt:'',offeredAt:'',createdAt:undefined}); await repositories.ideas.put(copy); return copy; }
export async function updateStatus(id,status){ return applyStatus(id,status); }
async function applyStatus(id,status){ const idea=await getIdea(id); if(!idea) return null; const normalized=normalizeIdeaStatus(status); const stamp=normalized==='offert'?'offeredAt':''; const now=nowIso(); const next={...idea,status:normalized,updatedAt:now}; if(stamp && !next[stamp]) next[stamp]=now; await repositories.ideas.put(next); return next; }
export async function requestIdeaStatusChange(id,nextStatus){ const idea=await getIdea(id); if(!idea) return null; const normalized=normalizeIdeaStatus(nextStatus); if(normalized==='offert'){
  if(isIdeaOffered(idea)) return idea;
  const ok=await confirmDialog({message:'Marquer cette idée comme offerte et l’ajouter à l’historique ?',confirmText:'Marquer comme offert'});
  if(!ok) return null;
  const next=await applyStatus(id,'offert');
  await historyFromIdea(next, null);
  return next;
 }
 return applyStatus(id,normalized);
}
export async function abandonIdea(id){ return requestIdeaStatusChange(id,'abandonne'); }
export async function deleteIdea(id){ await repositories.ideas.delete(id); }
export async function ideasForPerson(personId){ return (await listIdeas()).filter(i=>i.personId===personId); }
