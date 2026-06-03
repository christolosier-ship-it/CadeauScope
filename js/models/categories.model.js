import { uid } from '../utils/ids.js';
import { nowIso } from '../utils/dates.js';
export function createCategory(data = {}) { const now = nowIso(); return { id: data.id || uid('cat'), name: (data.name || '').trim(), type: data.type || 'custom', archived: Boolean(data.archived), createdAt: data.createdAt || now, updatedAt: now }; }
