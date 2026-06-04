export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const escapeAttr = escapeHtml;
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const includesText = (haystack, needle) => normalize(haystack).includes(normalize(needle));
export function safeHttpUrl(value){ const url=String(value ?? '').trim(); if(!url) return ''; return /^https?:\/\//i.test(url) ? url : ''; }
