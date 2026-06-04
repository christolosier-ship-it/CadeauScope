import { listIdeas } from './ideas.service.js';
import { listPeople } from './people.service.js';
import { eventsToPrepare, eventReminderStats } from './occasions.service.js';
import { daysUntil, nextBirthday } from '../utils/dates.js';
import { isIdeaActive, isIdeaOffered } from '../models/ideas.model.js';
export async function dashboard(){ const [ideas,people,events]=await Promise.all([listIdeas(),listPeople(true),eventsToPrepare()]); const activePeople=people.filter(p=>!p.archived); const enrichedEvents=events.map(event=>({...event,...eventReminderStats(event,people,ideas)})); const peopleToPrepare=activePeople.map(p=>({person:p,date:nextBirthday(p)})).filter(x=>x.date).sort((a,b)=>daysUntil(a.date)-daysUntil(b.date)); return { ideas, people:activePeople, events:enrichedEvents, peopleToPrepare, counts:{ total:ideas.length, available:ideas.filter(isIdeaActive).length, offered:ideas.filter(isIdeaOffered).length, events:enrichedEvents.length } }; }
