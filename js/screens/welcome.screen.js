import { setMain } from '../ui/dom.js';
import { APP } from '../config.js';
import { saveSettings } from '../services/settings.service.js';
import { navigate } from '../router.js';
export async function renderWelcome(){ setMain(`<section class="welcome screen"><div class="hero"><h1>🎁 ${APP.name}</h1><p>${APP.slogan}</p></div><div class="card"><p>La prochaine phrase du type “ça a l’air sympa” est une proie. Capture-la en moins de 10 secondes, sans compte, sans cloud, sans vendeur caché derrière le sapin.</p><div class="actions"><button class="btn primary" data-go="people">Ajouter une personne</button><button class="btn ghost" data-go="settings">Importer une sauvegarde</button><button class="btn" data-go="home">Découvrir l’app</button></div></div></section>`); document.querySelectorAll('[data-go]').forEach(b=>b.onclick=async()=>{ await saveSettings({firstLaunchDone:true}); navigate(b.dataset.go); }); }
