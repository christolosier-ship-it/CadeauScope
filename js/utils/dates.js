export const nowIso = () => new Date().toISOString();
export function todayInput(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const FR_DATE = /^(\d{2})-(\d{2})-(\d{4})$/;
const FR_BIRTHDAY = /^(\d{2})-(\d{2})(?:-(\d{4}))?$/;
const LEGACY_BIRTHDAY = /^(\d{2})-(\d{2})$/;

function pad(value) { return String(value).padStart(2, '0'); }
export function isValidDateParts(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1000 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function toIso(year, month, day) { return `${year}-${pad(month)}-${pad(day)}`; }
function monthDayFromParts(month, day) { return `${pad(month)}-${pad(day)}`; }

export function parseFrenchDate(value) {
  const raw = String(value || '').trim();
  const match = raw.match(FR_DATE);
  if (!match) return { value: '', error: raw ? 'Date attendue au format JJ-MM-AAAA.' : '' };
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!isValidDateParts(year, month, day)) return { value: '', error: 'Date invalide.' };
  return { value: toIso(year, month, day), error: '' };
}

export function normalizeLegacyDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const iso = raw.match(ISO_DATE);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    return isValidDateParts(year, month, day) ? toIso(year, month, day) : '';
  }
  const parsed = parseFrenchDate(raw);
  return parsed.value;
}

export function formatDateFr(value) {
  const iso = normalizeLegacyDate(value);
  if (!iso) return value ? '' : 'Non renseigné';
  const match = iso.match(ISO_DATE);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return `${pad(day)}-${pad(month)}-${year}`;
}

export function parseFrenchBirthday(value) {
  const raw = String(value || '').trim();
  const match = raw.match(FR_BIRTHDAY);
  if (!match) return { value: '', error: raw ? 'Anniversaire attendu au format JJ-MM.' : '' };
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = match[3] ? Number(match[3]) : 2000;
  if (!isValidDateParts(year, month, day)) return { value: '', error: 'Date invalide.' };
  return { value: monthDayFromParts(month, day), error: '' };
}

export function normalizeLegacyBirthday(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const iso = raw.match(ISO_DATE);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    return isValidDateParts(year, month, day) ? monthDayFromParts(month, day) : '';
  }
  const fr = raw.match(FR_BIRTHDAY);
  if (fr) {
    const day = Number(fr[1]);
    const month = Number(fr[2]);
    const year = fr[3] ? Number(fr[3]) : 2000;
    if (isValidDateParts(year, month, day)) return monthDayFromParts(month, day);
  }
  const legacy = raw.match(LEGACY_BIRTHDAY);
  if (legacy) {
    const month = Number(legacy[1]);
    const day = Number(legacy[2]);
    return isValidDateParts(2000, month, day) ? monthDayFromParts(month, day) : '';
  }
  return '';
}


export function formatBirthdayFr(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Non renseigné';
  const iso = raw.match(ISO_DATE);
  if (iso) return `${iso[3]}-${iso[2]}`;
  const md = raw.match(LEGACY_BIRTHDAY) ? raw : normalizeLegacyBirthday(raw);
  return md ? `${md.slice(3, 5)}-${md.slice(0, 2)}` : '';
}

export function addDays(date, days){ const d=new Date(date); d.setDate(d.getDate()+days); return d; }
export function daysUntil(dateString){ const normalized = normalizeLegacyDate(dateString); if(!normalized) return Number.POSITIVE_INFINITY; const target=new Date(normalized+'T00:00:00'); const now=new Date(todayInput()+'T00:00:00'); return Math.ceil((target-now)/86400000); }
export function formatDate(dateString){ return formatDateFr(dateString); }
export function normalizeDate(value){ return normalizeLegacyDate(value); }
export function nextAnnualDate(monthDay, fromDate = new Date()){
  if(!monthDay) return '';
  const raw = String(monthDay);
  const md = /^\d{2}-\d{2}$/.test(raw) ? raw : (normalizeLegacyBirthday(raw) || raw.slice(5));
  const [month, day] = md.split('-').map(Number);
  if(!Number.isInteger(month) || !Number.isInteger(day)) return '';
  const today = new Date(todayInput(fromDate)+'T00:00:00');
  let year = fromDate.getFullYear();
  for(let i = 0; i < 12; i += 1){
    if(!isValidDateParts(year, month, day)){ year += 1; continue; }
    const candidate = toIso(year, month, day);
    if(new Date(candidate+'T00:00:00') >= today) return candidate;
    year += 1;
  }
  return '';
}
export function nextBirthday(person){ if(!person?.birthday) return ''; return nextAnnualDate(normalizeLegacyBirthday(person.birthday)); }
export function nextChristmas(){ return nextAnnualDate('12-25'); }
export function isWithin(dateString, days){ const d=daysUntil(dateString); return d>=0 && d<=Number(days); }
export function monthsAgo(iso){ return (Date.now()-new Date(iso).getTime())/(86400000*30.44); }
