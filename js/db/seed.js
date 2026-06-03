import { repositories } from './repositories.js';
import { defaultSettings } from '../models/settings.model.js';
import { createCategory } from '../models/categories.model.js';
export const DEFAULT_CATEGORIES = [
 ['cat_hightech','High-tech'],['cat_maison','Maison'],['cat_cuisine','Cuisine'],['cat_livre','Livre'],['cat_jeu_jouet','Jeu / jouet'],['cat_vetement','Vêtement'],['cat_bijou','Bijou'],['cat_experience','Expérience'],['cat_sport','Sport'],['cat_bricolage','Bricolage'],['cat_beaute_soin','Beauté / soin'],['cat_humour','Humour'],['cat_autre','Autre']
];
export async function seedDefaults(){
  if(!(await repositories.settings.get('main'))) await repositories.settings.put(defaultSettings());
  const existing = await repositories.categories.all();
  for (const [id,name] of DEFAULT_CATEGORIES) if(!existing.some(c=>c.id===id)) await repositories.categories.put(createCategory({id,name,type:'default'}));
}
