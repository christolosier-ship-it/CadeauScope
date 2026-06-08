import { repositories } from '../db/repositories.js';
import { createOccasion } from '../models/occasions.model.js';
import { validateOccasion, hasErrors } from './validation.service.js';
import { getSettings, saveSettings } from './settings.service.js';
import { daysUntil, isWithin, nowIso, nextAnnualDate, todayInput, normalizeLegacyBirthday } from '../utils/dates.js';

export const DEFAULT_CLASSIC_EVENTS = [
  { id: 'classic_noel', name: 'Noël', type: 'christmas', monthDay: '12-25', reminderDays: 60, notes: 'Événement classique préinstallé.' },
  { id: 'classic_paques', name: 'Pâques', type: 'paques', dateFn: easterDate, reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_fete_meres', name: 'Fête des mères', type: 'fete_meres', dateFn: mothersDayFrance, reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_fete_peres', name: 'Fête des pères', type: 'fete_peres', dateFn: fathersDayFrance, reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_fete_grands_meres', name: 'Fête des grands-mères', type: 'fete_grands_meres', dateFn: grandmothersDayFrance, reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_fete_grands_peres', name: 'Fête des grands-pères', type: 'fete_grands_peres', dateFn: grandfathersDayFrance, reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_saint_valentin', name: 'Saint-Valentin', type: 'saint_valentin', monthDay: '02-14', reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_halloween', name: 'Halloween', type: 'halloween', monthDay: '10-31', reminderDays: 30, notes: 'Événement classique préinstallé.' },
  { id: 'classic_rentree', name: 'Rentrée scolaire', type: 'rentree', monthDay: '09-01', reminderDays: 30, notes: 'Événement classique préinstallé.' }
];

const ymd = date => date.toISOString().slice(0, 10);
const dateUtc = (year, month, day) => new Date(Date.UTC(year, month - 1, day));
const currentYear = () => Number(todayInput().slice(0, 4));

function firstSunday(year, month) { const d = dateUtc(year, month, 1); d.setUTCDate(1 + ((7 - d.getUTCDay()) % 7)); return ymd(d); }
function lastSunday(year, month) { const d = dateUtc(year, month + 1, 0); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return ymd(d); }
function nthSunday(year, month, n) { const d = dateUtc(year, month, 1); d.setUTCDate(1 + ((7 - d.getUTCDay()) % 7) + ((n - 1) * 7)); return ymd(d); }
function nextCalculated(fn) { const y = currentYear(); const date = fn(y); return daysUntil(date) < 0 ? fn(y + 1) : date; }

export function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return ymd(dateUtc(year, month, day));
}
export function grandmothersDayFrance(year) { return firstSunday(year, 3); }
export function fathersDayFrance(year) { return nthSunday(year, 6, 3); }
export function grandfathersDayFrance(year) { return firstSunday(year, 10); }
export function mothersDayFrance(year) { const lastMay = lastSunday(year, 5); return lastMay === pentecostDate(year) ? firstSunday(year, 6) : lastMay; }
export function pentecostDate(year) { const d = new Date(`${easterDate(year)}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 49); return ymd(d); }

export function nextEventDate(event = {}) { if (event.dateFn) return nextCalculated(event.dateFn); if (event.monthDay) return nextAnnualDate(event.monthDay); return event.date || ''; }
export function birthdayEventId(personId) { return `birthday_${personId}`; }
export function normalizePersonIds(personIds = [], people = []) { const valid = new Set(people.map(p => p.id)); return [...new Set(personIds)].filter(id => valid.has(id)); }
export function availableIdeasForEvent(event, ideas = []) { const ids = new Set(event?.personIds || []); return ideas.filter(i => ids.has(i.personId) && !i.archived && ['idee', 'idée', 'idea', 'a_acheter', 'à acheter', 'to_buy', 'achete', 'acheté', 'bought', 'emballe', 'emballé', 'wrapped'].includes(String(i.status || 'idee').trim().toLowerCase())); }
export function shouldShowEventReminder(event, people = [], ideas = [], settings = {}) {
  if (!event || event.archived || event.hidden) return false;
  const activePeople = new Set(people.filter(p => !p.archived).map(p => p.id));
  const linked = (event.personIds || []).filter(id => activePeople.has(id));
  if (!linked.length) return false;
  if (event.source === 'birthday' && linked.some(id => people.find(p => p.id === id)?.archived)) return false;
  const windowDays = Number(event.reminderDays || (event.type === 'christmas' ? settings.christmasWarningDays : settings.eventWarningDays) || 30);
  return isWithin(event.date, windowDays);
}
export function shouldShowEventInAll(event, settings = {}) {
  if (!event || event.archived || event.hidden) return false;
  if (event.id === 'classic_noel' || event.type === 'christmas') return true;
  if (event.source === 'birthday' || event.type === 'birthday') {
    const windowDays = Number(event.reminderDays || settings.eventWarningDays || 30);
    return isWithin(event.date, windowDays);
  }
  return true;
}
export function eventReminderStats(event, people = [], ideas = []) { const activePeople = new Set(people.filter(p => !p.archived).map(p => p.id)); const personIds = (event.personIds || []).filter(id => activePeople.has(id)); return { personCount: personIds.length, ideaCount: availableIdeasForEvent({ ...event, personIds }, ideas).length }; }

export const listManualOccasions = () => repositories.occasions.all();

async function allPeople(includeArchived = true) { return (await repositories.people.all()).filter(p => includeArchived || !p.archived); }

function normalizeEvent(item, people = []) {
  const classic = DEFAULT_CLASSIC_EVENTS.find(e => e.id === item.id || e.type === item.type);
  const isBirthday = item.source === 'birthday' || item.id?.startsWith?.('birthday_') || item.id?.startsWith?.('auto_birthday_');
  const next = createOccasion({
    ...item,
    id: item.id?.startsWith?.('auto_birthday_') ? item.id.replace('auto_birthday_', 'birthday_') : item.id,
    name: item.name || classic?.name || 'Événement',
    type: classic?.type || item.type || (isBirthday ? 'birthday' : 'autre'),
    date: classic ? nextEventDate(classic) : item.date,
    personIds: normalizePersonIds(item.personIds || [], people),
    source: isBirthday ? 'birthday' : (classic ? 'classic' : (item.source === 'auto' ? 'classic' : (item.source || 'manual'))),
    reminderDays: item.reminderDays || classic?.reminderDays || 30,
    hidden: Boolean(item.hidden),
    archived: Boolean(item.archived)
  });
  return next;
}

export async function ensureClassicEvents() {
  const [existing, people, settings] = await Promise.all([repositories.occasions.all(), allPeople(true), getSettings()]);
  const shouldMigrateChristmas = settings.legacyChristmasMigrated !== true;
  for (const event of DEFAULT_CLASSIC_EVENTS) {
    const found = existing.find(o => o.id === event.id || (o.type === event.type && o.source !== 'birthday'));
    const migratedChristmasIds = event.id === 'classic_noel' && shouldMigrateChristmas ? people.filter(p => p.christmasEnabled === true).map(p => p.id) : [];
    const personIds = Array.from(new Set([...(found?.personIds || []), ...migratedChristmasIds]));
    const next = normalizeEvent(found ? { ...found, id: event.id, ...event, personIds } : { ...event, date: nextEventDate(event), personIds, source: 'classic' }, people);
    await repositories.occasions.put(next);
    if (found?.id && found.id !== event.id) await repositories.occasions.delete(found.id);
  }
  if (shouldMigrateChristmas) {
    for (const person of people.filter(p => p.christmasEnabled === true)) {
      await repositories.people.put({ ...person, christmasEnabled: false, updatedAt: nowIso() });
    }
    await saveSettings({ ...settings, legacyChristmasMigrated: true });
  }
}

export async function syncBirthdayEvents() {
  const [people, events] = await Promise.all([allPeople(true), repositories.occasions.all()]);
  const byId = new Map(events.map(o => [o.id, o]));
  for (const person of people) {
    const id = birthdayEventId(person.id);
    const legacyId = `auto_birthday_${person.id}`;
    const legacy = byId.get(legacyId);
    if (legacy) { if (!byId.has(id)) byId.set(id, { ...legacy, id }); await repositories.occasions.delete(legacyId); byId.delete(legacyId); }
    const existing = byId.get(id);
    if (!person.birthday) {
      if (existing) await repositories.occasions.put({ ...existing, hidden: true, archived: true, updatedAt: nowIso() });
      continue;
    }
    await repositories.occasions.put(createOccasion({
      ...existing,
      id,
      name: `Anniversaire de ${person.name}`,
      type: 'birthday',
      date: nextAnnualDate(normalizeLegacyBirthday(person.birthday)),
      personIds: [person.id],
      totalBudget: existing?.totalBudget ?? null,
      notes: existing?.notes || '',
      status: 'a_venir',
      source: 'birthday',
      reminderDays: existing?.reminderDays || 30,
      hidden: false,
      archived: Boolean(person.archived),
      createdAt: existing?.createdAt
    }));
  }
  const validBirthdayIds = new Set(people.map(p => birthdayEventId(p.id)));
  for (const event of events.filter(o => (o.source === 'birthday' || o.id?.startsWith?.('birthday_')) && !validBirthdayIds.has(o.id))) {
    await repositories.occasions.put({ ...event, hidden: true, archived: true, updatedAt: nowIso() });
  }
}

export async function normalizeOccasions() {
  const [events, people] = await Promise.all([repositories.occasions.all(), allPeople(true)]);
  for (const event of events) await repositories.occasions.put(normalizeEvent(event, people));
  await ensureClassicEvents();
  await syncBirthdayEvents();
}

export async function saveOccasion(data) {
  const errors = validateOccasion(data);
  if (hasErrors(errors)) throw Object.assign(new Error('Événement invalide'), { errors });
  const existing = data.id ? await repositories.occasions.get(data.id) : null;
  const people = await allPeople(true);
  const item = createOccasion({ ...existing, ...data, personIds: normalizePersonIds(data.personIds || existing?.personIds || [], people), source: existing?.source || data.source || 'manual', createdAt: existing?.createdAt });
  await repositories.occasions.put(item);
  return item;
}
export async function getOccasion(id) { await normalizeOccasions(); return repositories.occasions.get(id); }
export async function christmasOccasion() { await normalizeOccasions(); return repositories.occasions.get('classic_noel'); }
export async function automaticBirthdays(force = false) { await syncBirthdayEvents(); const all = (await repositories.occasions.all()).filter(o => o.source === 'birthday'); return force ? all : all.filter(o => !o.hidden && !o.archived); }
export async function listOccasions(filter = 'a_venir') {
  await normalizeOccasions();
  const [events, people, ideas, settings] = await Promise.all([repositories.occasions.all(), allPeople(true), repositories.ideas.all(), getSettings()]);
  let all = events.map(o => ({ ...o, date: o.source === 'classic' ? nextEventDate(DEFAULT_CLASSIC_EVENTS.find(e => e.id === o.id) || o) : (o.source === 'birthday' ? nextEventDate({ monthDay: o.date?.slice(5) || normalizeLegacyBirthday(o.date) || '' }) : o.date) }));
  if (filter === 'preparer' || filter === 'a_venir') all = all.filter(o => shouldShowEventReminder(o, people, ideas, settings));
  else if (filter === 'masques' || filter === 'archivees') all = all.filter(o => o.archived || o.hidden);
  else if (filter === 'toutes') all = all.filter(o => shouldShowEventInAll(o, settings));
  else if (filter) all = all.filter(o => !o.archived && !o.hidden);
  return all.sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
}
export async function eventsToPrepare() {
  const [events, people, ideas, settings] = await Promise.all([listOccasions('toutes'), allPeople(true), repositories.ideas.all(), getSettings()]);
  return events.filter(o => shouldShowEventReminder(o, people, ideas, settings)).sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
}
export async function updateEventPeople(id, personIds = []) { const event = await repositories.occasions.get(id); if (!event) return null; return saveOccasion({ ...event, personIds }); }
export async function closeOccasion(id) { const o = await repositories.occasions.get(id); if (!o) return null; const next = { ...o, status: 'terminee', updatedAt: nowIso() }; await repositories.occasions.put(next); return next; }
export async function hideOccasion(id, hidden = true) { const o = await repositories.occasions.get(id); if (!o) return null; const next = { ...o, hidden, archived: hidden, updatedAt: nowIso() }; await repositories.occasions.put(next); return next; }
export async function deleteOccasion(id) {
  const o = await repositories.occasions.get(id);
  if (o?.source === 'classic' || o?.source === 'birthday') return hideOccasion(id, true);
  const ideas = await repositories.ideas.all();
  for (const idea of ideas.filter(i => i.occasionId === id)) {
    await repositories.ideas.put({ ...idea, occasionId: '', occasionMode: 'none', updatedAt: nowIso() });
  }
  await repositories.occasions.delete(id);
}
