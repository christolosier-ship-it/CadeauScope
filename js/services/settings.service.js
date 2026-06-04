import { repositories } from '../db/repositories.js';
import { defaultSettings } from '../models/settings.model.js';
import { validateSettings, hasErrors } from './validation.service.js';
export async function getSettings(){ return (await repositories.settings.get('main')) || defaultSettings(); }
export async function saveSettings(data){ const errors=validateSettings(data); if(hasErrors(errors)) throw Object.assign(new Error('Réglages invalides'),{errors}); const existing=await getSettings(); const item=defaultSettings({...existing,...data,createdAt:existing.createdAt}); await repositories.settings.put(item); return item; }
export function applyTheme(settings = {}) {
  const theme = settings.theme || 'auto';
  const root = document.documentElement;

  if (theme === 'dark' || theme === 'light') {
    root.dataset.theme = theme;
  } else {
    root.removeAttribute('data-theme');
  }
}
