import { listIdeas } from './ideas.service.js';
import { listPeople } from './people.service.js';
import { listOccasions } from './occasions.service.js';
import { getSettings } from './settings.service.js';
import { daysUntil, isWithin, nextBirthday, nextChristmas } from '../utils/dates.js';
import { isIdeaActive, isIdeaOffered } from '../models/ideas.model.js';
export async function dashboard(){ const [ideas,people,settings,occasions]=await Promise.all([listIdeas(),listPeople(),getSettings(),listOccasions('toutes')]); const events=occasions.filter(o=>o.type==='christmas'?isWithin(nextChristmas(),settings.christmasWarningDays):isWithin(o.date,settings.eventWarningDays)).sort((a,b)=>daysUntil(a.date)-daysUntil(b.date)); const peopleToPrepare=people.map(p=>({person:p,date:p.christmasEnabled && daysUntil(nextChristmas()) < daysUntil(nextBirthday(p)||'2999-01-01') ? nextChristmas() : nextBirthday(p)})).filter(x=>x.date).sort((a,b)=>daysUntil(a.date)-daysUntil(b.date)); return { ideas, people, events, peopleToPrepare, counts:{ total:ideas.length, available:ideas.filter(isIdeaActive).length, offered:ideas.filter(isIdeaOffered).length, events:events.length } }; }
