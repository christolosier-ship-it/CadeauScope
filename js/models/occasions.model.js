import { uid } from '../utils/ids.js';
import { nowIso, normalizeLegacyDate } from '../utils/dates.js';
import { cleanOptionalNumber } from '../utils/numbers.js';
export function createOccasion(data = {}) { const now = nowIso(); return { id: data.id || uid('event'), name: (data.name || '').trim(), type: data.type || 'autre', date: normalizeLegacyDate(data.date) || data.date || '', personIds: Array.isArray(data.personIds) ? data.personIds : [], totalBudget: cleanOptionalNumber(data.totalBudget,{min:0}), personBudgets: data.personBudgets || {}, notes: data.notes || '', status: data.status || 'a_venir', source: data.source || 'manual', reminderDays: data.reminderDays || null, hidden: Boolean(data.hidden), archived: Boolean(data.archived), createdAt: data.createdAt || now, updatedAt: now }; }
