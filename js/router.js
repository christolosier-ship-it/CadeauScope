import { state } from './state.js';
import { setChrome } from './ui/navigation.js';
import { renderWelcome } from './screens/welcome.screen.js';
import { renderHome } from './screens/home.screen.js';
import { renderQuickCapture } from './screens/quick-capture.screen.js';
import { renderIdeas } from './screens/ideas.screen.js';
import { renderIdeaDetail } from './screens/idea-detail.screen.js';
import { renderPeople } from './screens/people.screen.js';
import { renderPersonDetail } from './screens/person-detail.screen.js';
import { renderOccasions } from './screens/occasions.screen.js';
import { renderOccasionDetail } from './screens/occasion-detail.screen.js';
import { renderPanic } from './screens/panic.screen.js';
import { renderSettings } from './screens/settings.screen.js';
const screens={welcome:renderWelcome,home:renderHome,quick:renderQuickCapture,ideas:renderIdeas,idea:renderIdeaDetail,people:renderPeople,person:renderPersonDetail,occasions:renderOccasions,occasion:renderOccasionDetail,panic:renderPanic,settings:renderSettings};
export async function navigate(route='home', params={}){ state.route=route; state.params=params; history.replaceState(null,'',`#${route}${params.id?`/${params.id}`:''}`); setChrome(route); await screens[route](params); }
export function routeFromHash(){ const [,route='home',id] = location.hash.match(/^#?([^/]*)(?:\/(.*))?$/)||[]; return {route:route||'home', params:id?{id}:{}}; }
