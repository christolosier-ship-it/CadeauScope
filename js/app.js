import { seedDefaults } from './db/seed.js';
import { getSettings, applyTheme } from './services/settings.service.js';
import { navigate, routeFromHash } from './router.js';
import { normalizeOccasions } from './services/occasions.service.js';
import { $ } from './ui/dom.js';
async function start(){ await seedDefaults(); await normalizeOccasions(); const settings=await getSettings(); applyTheme(settings); if('serviceWorker' in navigator){ navigator.serviceWorker.register('./service-worker.js').catch(()=>{}); }
 document.body.addEventListener('click', e=>{ const btn=e.target.closest('[data-route]'); if(btn) navigate(btn.dataset.route,{id:btn.dataset.id, personId:btn.dataset.person, occasionId:btn.dataset.occasion}); }); $('#fab').onclick=()=>navigate('quick'); const initial=routeFromHash(); await navigate(settings.firstLaunchDone ? initial.route : 'welcome', initial.params); }
start().catch(err=>{ console.error(err); document.querySelector('#app').innerHTML='<div class="card empty">CadeauScope a trébuché sur un ruban. Recharge la page.</div>'; });
