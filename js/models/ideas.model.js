import { uid } from '../utils/ids.js';
import { nowIso } from '../utils/dates.js';
import { cleanOptionalNumber } from '../utils/numbers.js';

export const IDEA_DISPLAY_STATES = {
  active: 'Idée',
  offered: 'Offert',
  abandoned: 'Abandonnée'
};

const ACTIVE_STATUSES = new Set(['idee', 'idée', 'idea', 'a_acheter', 'à acheter', 'to_buy', 'achete', 'acheté', 'bought', 'emballe', 'emballé', 'wrapped']);
const OFFERED_STATUSES = new Set(['offert', 'offerte', 'offered']);
const ABANDONED_STATUSES = new Set(['abandonne', 'abandonné', 'abandonnée', 'abandoned']);

function statusKey(status) {
  return String(status || 'idee').trim().toLowerCase();
}

export function getIdeaDisplayState(idea = {}) {
  const status = statusKey(idea.status);
  if (OFFERED_STATUSES.has(status)) return 'offered';
  if (ABANDONED_STATUSES.has(status)) return 'abandoned';
  return 'active';
}

export const isIdeaActive = idea => getIdeaDisplayState(idea) === 'active';
export const isIdeaOffered = idea => getIdeaDisplayState(idea) === 'offered';
export const isIdeaAbandoned = idea => getIdeaDisplayState(idea) === 'abandoned';

export function normalizeIdeaStatus(status) {
  const key = statusKey(status);
  if (OFFERED_STATUSES.has(key)) return 'offert';
  if (ABANDONED_STATUSES.has(key)) return 'abandonne';
  if (ACTIVE_STATUSES.has(key)) return 'idee';
  return 'idee';
}

export function createIdea(data = {}) {
  const now = nowIso();
  return {
    id: data.id || uid('idea'),
    personId: data.personId || '',
    title: (data.title || '').trim(),
    description: data.description || '',
    note: data.note || '',
    estimatedPrice: cleanOptionalNumber(data.estimatedPrice, { min: 0 }),
    priceText: data.priceText || '',
    link: String(data.link || '').trim(),
    photoId: data.photoId || '',
    categoryId: data.categoryId || 'cat_autre',
    occasionMode: data.occasionMode || 'none',
    occasionId: data.occasionId || '',
    occasionYear: data.occasionYear || '',
    interestLevel: Number.isFinite(Number(data.interestLevel || 2)) ? Number(data.interestLevel || 2) : 2,
    status: normalizeIdeaStatus(data.status),
    createdAt: data.createdAt || now,
    updatedAt: now,
    boughtAt: data.boughtAt || '',
    wrappedAt: data.wrappedAt || '',
    offeredAt: data.offeredAt || '',
    archived: Boolean(data.archived)
  };
}
