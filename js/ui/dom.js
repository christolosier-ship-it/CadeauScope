export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
export function html(strings,...values){ return strings.map((s,i)=>s+(values[i] ?? '')).join(''); }
export function setMain(markup){ $('#app').innerHTML=markup; window.scrollTo({top:0,behavior:'instant'}); }
export function serializeForm(form){ return Object.fromEntries(new FormData(form).entries()); }
