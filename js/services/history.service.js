import { repositories } from '../db/repositories.js';
import { createHistory } from '../models/history.model.js';
import { validateHistory, hasErrors } from './validation.service.js';
export const listHistory = () => repositories.history.all();
export async function saveHistory(data){ const errors=validateHistory(data); if(hasErrors(errors)) throw Object.assign(new Error('Historique invalide'),{errors}); const item=createHistory(data); await repositories.history.put(item); return item; }
export async function historyFromIdea(idea, occasion){ const existing=(await listHistory()).find(h=>h.ideaId===idea.id); if(existing) return existing; return saveHistory({ personId:idea.personId, ideaId:idea.id, occasionId:idea.occasionId, occasionNameSnapshot:occasion?.name||'', title:idea.title, price:idea.realPrice ?? idea.estimatedPrice, priceText:idea.priceText, note:idea.note }); }
export async function historyForPerson(personId){ return (await listHistory()).filter(h=>h.personId===personId); }
