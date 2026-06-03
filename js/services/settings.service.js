import { repositories } from '../db/repositories.js';
import { defaultSettings } from '../models/settings.model.js';
import { nowIso } from '../utils/dates.js';
export async function getSettings(){ return (await repositories.settings.get('main')) || defaultSettings(); }
export async function saveSettings(patch){ const current=await getSettings(); const next={...current,...patch,id:'main',updatedAt:nowIso()}; await repositories.settings.put(next); applyTheme(next); return next; }
export function applyTheme(settings){ const theme=settings.theme || 'auto'; const dark = theme==='dark' || (theme==='auto' && matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }
