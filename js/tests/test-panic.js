import assert from 'node:assert/strict';
import { panicResults } from '../services/panic.service.js';
import { samplePeople, sampleIdeas } from './test-data.js';
const res=panicResults({ideas:sampleIdeas,people:samplePeople,criteria:{personId:'p1',budgetMax:100}});
assert.equal(res.best[0].idea.id,'i1');
assert.equal(res.outOfBudget[0].idea.id,'i2');
const scoped=panicResults({
  people:[{id:'p1',archived:false},{id:'p2',archived:false}],
  ideas:[
    {id:'old-linked',personId:'p1',status:'idee',occasionId:'occ1',estimatedPrice:10,createdAt:new Date().toISOString()},
    {id:'person-match',personId:'p2',status:'idee',occasionId:'other',estimatedPrice:10,createdAt:new Date().toISOString()}
  ],
  criteria:{personIds:['p2'],budgetMax:50}
});
assert.deepEqual(scoped.best.map(x=>x.idea.id), ['person-match']);
console.log('test-panic ok');
