import assert from 'node:assert/strict';
import { spentForOccasion } from '../services/budget.service.js';
assert.equal(spentForOccasion([{status:'achete',estimatedPrice:10},{status:'a_acheter',estimatedPrice:99},{status:'offert',estimatedPrice:5}]),15);
console.log('test-budget ok');
