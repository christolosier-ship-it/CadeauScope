import { repositories } from '../db/repositories.js';
import { createCategory } from '../models/categories.model.js';
import { nowIso } from '../utils/dates.js';
export const listCategories = () => repositories.categories.all();
export async function activeCategories(){ return (await listCategories()).filter(c=>!c.archived); }
export async function saveCategory(data){ const item=createCategory(data); await repositories.categories.put(item); return item; }
export async function archiveCategory(id, archived=true){ const c=await repositories.categories.get(id); if(!c || c.type==='default') return c; const next={...c,archived,updatedAt:nowIso()}; await repositories.categories.put(next); return next; }
