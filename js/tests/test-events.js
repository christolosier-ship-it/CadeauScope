import assert from 'node:assert/strict';
import { DEFAULT_CLASSIC_EVENTS, availableIdeasForEvent, birthdayEventId, easterDate, eventReminderStats, mothersDayFrance, nextEventDate, normalizePersonIds, shouldShowEventInAll, shouldShowEventReminder } from '../services/occasions.service.js';

assert.ok(DEFAULT_CLASSIC_EVENTS.some(event => event.id === 'classic_noel' && event.name === 'Noël'));
assert.equal(new Set(DEFAULT_CLASSIC_EVENTS.map(event => event.id)).size, DEFAULT_CLASSIC_EVENTS.length);
assert.equal(easterDate(2026), '2026-04-05');
assert.equal(mothersDayFrance(2026), '2026-05-31');
assert.equal(birthdayEventId('p1'), 'birthday_p1');
assert.deepEqual(normalizePersonIds(['p1','p1','missing','p2'], [{id:'p1'},{id:'p2'}]), ['p1','p2']);

const people = [{id:'p1', archived:false}, {id:'p2', archived:false}, {id:'p3', archived:true}];
const ideas = [
  {id:'active', personId:'p1', status:'idee'},
  {id:'legacy', personId:'p1', status:'achete', occasionId:'old'},
  {id:'offered', personId:'p1', status:'offert'},
  {id:'abandoned', personId:'p2', status:'abandonne'},
  {id:'archived-person', personId:'p3', status:'idee'}
];
const future = nextEventDate({ monthDay: '12-25' });
const event = { id:'classic_noel', type:'christmas', date:future, personIds:['p1'], reminderDays: 999 };
assert.deepEqual(availableIdeasForEvent(event, ideas).map(i=>i.id), ['active','legacy']);
assert.equal(shouldShowEventReminder({...event, personIds:[]}, people, ideas, {christmasWarningDays:999}), false);
assert.equal(shouldShowEventReminder(event, people, ideas, {christmasWarningDays:999}), true);
assert.equal(shouldShowEventReminder({...event, personIds:['p3'], source:'birthday'}, people, ideas, {eventWarningDays:999}), false);
assert.deepEqual(eventReminderStats(event, people, ideas), {personCount:1, ideaCount:2});
assert.equal(shouldShowEventInAll({id:'classic_noel', type:'christmas', date:future, source:'classic'}, {eventWarningDays:1}), true);
assert.equal(shouldShowEventInAll({id:'birthday_p1', type:'birthday', source:'birthday', date:future, reminderDays:1}, {eventWarningDays:1}), false);
assert.equal(shouldShowEventInAll({...event, hidden:true}, {christmasWarningDays:999}), false);
console.log('test-events ok');
assert.equal(nextEventDate({ monthDay: '06-04' }).slice(5), '06-04');
