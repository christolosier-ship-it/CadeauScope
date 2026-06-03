import assert from 'node:assert/strict';
import { panicResults } from '../services/panic.service.js';
import { samplePeople, sampleIdeas } from './test-data.js';
const res=panicResults({ideas:sampleIdeas,people:samplePeople,criteria:{personId:'p1',budgetMax:100}});
assert.equal(res.best[0].idea.id,'i1');
assert.equal(res.outOfBudget[0].idea.id,'i2');
console.log('test-panic ok');
