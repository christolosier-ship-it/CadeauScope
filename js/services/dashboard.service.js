import { listIdeas } from './ideas.service.js';
import { listPeople } from './people.service.js';
import { eventsToPrepare, eventReminderStats } from './occasions.service.js';
import { isIdeaActive, isIdeaOffered } from '../models/ideas.model.js';
export async function dashboard(){ const [ideas,people,events]=await Promise.all([listIdeas(),listPeople(true),eventsToPrepare()]); const activePeople=people.filter(p=>!p.archived); const enrichedEvents=events.map(event=>({...event,...eventReminderStats(event,people,ideas)})); const nearbyPersonIds=new Set(enrichedEvents.flatMap(event=>event.personIds||[])); const peopleWithoutIdeas=activePeople.filter(p=>nearbyPersonIds.has(p.id) && !ideas.some(i=>i.personId===p.id && isIdeaActive(i))); return { ideas, people:activePeople, events:enrichedEvents, peopleWithoutIdeas, counts:{ total:ideas.length, available:ideas.filter(isIdeaActive).length, offered:ideas.filter(isIdeaOffered).length, events:enrichedEvents.length } }; }
