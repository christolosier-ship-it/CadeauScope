export const nowIso = () => new Date().toISOString();
export const todayInput = () => new Date().toISOString().slice(0,10);
export function addDays(date, days){ const d=new Date(date); d.setDate(d.getDate()+days); return d; }
export function daysUntil(dateString){ const target=new Date(dateString+'T00:00:00'); const now=new Date(todayInput()+'T00:00:00'); return Math.ceil((target-now)/86400000); }
export function formatDate(dateString){ if(!dateString) return 'Non renseigné'; return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'long',year: dateString.length > 7 ? 'numeric' : undefined}).format(new Date(normalizeDate(dateString)+'T00:00:00')); }
export function normalizeDate(value){ if(!value) return ''; if(/^\d{2}-\d{2}$/.test(value)) return `${new Date().getFullYear()}-${value}`; return value; }
export function nextAnnualDate(monthDay){ if(!monthDay) return ''; const md = monthDay.length === 5 ? monthDay : monthDay.slice(5); const y = new Date().getFullYear(); let date = `${y}-${md}`; if(daysUntil(date)<0) date = `${y+1}-${md}`; return date; }
export function nextBirthday(person){ if(!person?.birthday) return ''; return person.birthdayHasYear ? nextAnnualDate(person.birthday.slice(5)) : nextAnnualDate(person.birthday); }
export function nextChristmas(){ return nextAnnualDate('12-25'); }
export function isWithin(dateString, days){ const d=daysUntil(dateString); return d>=0 && d<=Number(days); }
export function monthsAgo(iso){ return (Date.now()-new Date(iso).getTime())/(86400000*30.44); }
