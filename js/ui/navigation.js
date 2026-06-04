import { $ } from './dom.js';
const items=[['home','🏠','Accueil'],['ideas','💡','Idées'],['people','👥','Personnes'],['occasions','📅','Événements'],['settings','⚙️','Réglages']];
export function renderNav(route){ $('#bottom-nav').innerHTML=items.map(([r,i,l])=>`<button class="nav-item ${route===r?'active':''}" data-route="${r}"><span class="nav-emoji">${i}</span><span class="nav-label">${l}</span></button>`).join(''); }
export function setChrome(route){ const formRoutes=['welcome','quick','idea','person','occasion','panic']; $('#bottom-nav').classList.toggle('hidden', route==='welcome'); $('#fab').classList.toggle('hidden', formRoutes.includes(route)); renderNav(route); }
