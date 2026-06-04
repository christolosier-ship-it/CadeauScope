import { STATUSES, INTEREST_LEVELS, RELATIONS, OCCASION_TYPES, OCCASION_STATUS, REACTIONS } from '../config.js';
import { escapeHtml, escapeAttr } from '../utils/strings.js';
export const options = (obj, selected='') => Object.entries(obj).map(([v,l])=>`<option value="${escapeAttr(v)}" ${v==selected?'selected':''}>${escapeHtml(l)}</option>`).join('');
export const peopleOptions = (people, selected='') => people.map(p=>`<option value="${escapeAttr(p.id)}" ${p.id==selected?'selected':''}>${escapeHtml(p.name)}</option>`).join('');
export const categoryOptions = (cats, selected='cat_autre') => cats.map(c=>`<option value="${escapeAttr(c.id)}" ${c.id==selected?'selected':''}>${escapeHtml(c.name)}</option>`).join('');
export { STATUSES, INTEREST_LEVELS, RELATIONS, OCCASION_TYPES, OCCASION_STATUS, REACTIONS };
