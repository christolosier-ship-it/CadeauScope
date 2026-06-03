import { repositories } from '../db/repositories.js';
import { createHistory } from '../models/history.model.js';
export const listHistory = () => repositories.history.all();
export async function saveHistory(data){ const item=createHistory(data); await repositories.history.put(item); return item; }
export async function historyFromIdea(idea, occasion){ return saveHistory({ personId:idea.personId, ideaId:idea.id, occasionId:idea.occasionId, occasionNameSnapshot:occasion?.name||'', title:idea.title, price:idea.estimatedPrice, priceText:idea.priceText }); }
export async function historyForPerson(personId){ return (await listHistory()).filter(h=>h.personId===personId); }
