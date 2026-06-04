import assert from 'node:assert/strict';
import { createIdea, getIdeaDisplayState, isIdeaActive, isIdeaOffered, isIdeaAbandoned, normalizeIdeaStatus } from '../models/ideas.model.js';
import { safeHttpUrl } from '../utils/strings.js';

const minimal = createIdea({ personId: 'p1', title: 'Livre' });
assert.equal(minimal.personId, 'p1');
assert.equal(minimal.title, 'Livre');
assert.equal(minimal.occasionId, '');
assert.equal(minimal.occasionMode, 'none');
assert.equal(minimal.status, 'idee');
assert.equal(minimal.estimatedPrice, null);

for (const status of ['idee', 'idea', 'a_acheter', 'to_buy', 'achete', 'bought', 'emballe', 'wrapped']) {
  const idea = createIdea({ personId: 'p1', title: status, status });
  assert.equal(normalizeIdeaStatus(status), 'idee');
  assert.equal(getIdeaDisplayState(idea), 'active');
  assert.equal(isIdeaActive(idea), true);
}
assert.equal(isIdeaOffered(createIdea({ personId: 'p1', title: 'x', status: 'offered' })), true);
assert.equal(isIdeaAbandoned(createIdea({ personId: 'p1', title: 'x', status: 'abandoned' })), true);
assert.equal(createIdea({ personId: 'p1', title: 'x', estimatedPrice: 'abc' }).estimatedPrice, null);
assert.equal(safeHttpUrl('javascript:alert(1)'), '');
console.log('test-ideas ok');
