import { $ } from './dom.js';
export function toast(message){ const region=$('#toast-region'); const el=document.createElement('div'); el.className='toast'; el.textContent=message; region.append(el); setTimeout(()=>el.remove(),3200); }
