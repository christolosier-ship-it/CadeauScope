import { uid } from '../utils/ids.js';
import { nowIso } from '../utils/dates.js';
import { cleanOptionalNumber } from '../utils/numbers.js';
export function createOccasion(data = {}) { const now = nowIso(); return { id: data.id || uid('occasion'), name: (data.name || '').trim(), type: data.type || 'autre', date: data.date || '', personIds: data.personIds || [], totalBudget: cleanOptionalNumber(data.totalBudget,{min:0}), personBudgets: data.personBudgets || {}, notes: data.notes || '', status: data.status || 'a_venir', source: data.source || 'manual', archived: Boolean(data.archived), createdAt: data.createdAt || now, updatedAt: now }; }
