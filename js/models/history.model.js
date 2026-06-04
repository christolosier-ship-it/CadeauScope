import { uid } from '../utils/ids.js';
import { todayInput, nowIso } from '../utils/dates.js';
import { cleanOptionalNumber } from '../utils/numbers.js';
export function createHistory(data = {}) { const now = nowIso(); return { id: data.id || uid('hist'), personId: data.personId || '', ideaId: data.ideaId || '', occasionId: data.occasionId || '', occasionNameSnapshot: data.occasionNameSnapshot || '', title: (data.title || '').trim(), price: cleanOptionalNumber(data.price,{min:0}), priceText: data.priceText || '', date: data.date || todayInput(), reaction: data.reaction || '', note: data.note || '', createdAt: data.createdAt || now, updatedAt: now }; }
