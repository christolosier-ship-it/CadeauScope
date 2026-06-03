import { uid } from '../utils/ids.js';
import { nowIso } from '../utils/dates.js';
export function createPhoto(data = {}) { const now = nowIso(); return { id: data.id || uid('photo'), ownerType: data.ownerType || 'idea', ownerId: data.ownerId || '', blob: data.blob || null, mimeType: data.mimeType || '', createdAt: data.createdAt || now, updatedAt: now }; }
