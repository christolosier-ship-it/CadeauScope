import assert from 'node:assert/strict';
import { nextAnnualDate, daysUntil } from '../utils/dates.js';
assert.match(nextAnnualDate('12-25'), /^\d{4}-12-25$/);
assert.equal(typeof daysUntil(nextAnnualDate('12-25')), 'number');
console.log('test-dates ok');
