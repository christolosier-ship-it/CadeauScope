import { navigate } from '../router.js';
import { requestIdeaStatusChange } from '../services/ideas.service.js';
import { toast } from './toasts.js';
import { safeHttpUrl } from '../utils/strings.js';
export function bindIdeaCardActions(root=document,{onStatusChanged}={}){
  root.querySelectorAll('[data-idea-view]').forEach(b=>{ b.onclick=()=>navigate('idea',{id:b.dataset.ideaView}); });
  root.querySelectorAll('[data-idea-status]').forEach(b=>{ b.onclick=async()=>{ const changed=await requestIdeaStatusChange(b.dataset.ideaStatus,b.dataset.nextStatus); if(changed){ toast('Statut mis à jour. Le ruban progresse.'); if(onStatusChanged) await onStatusChanged(changed); } }; });
  root.querySelectorAll('[data-panic-link]').forEach(b=>{ b.onclick=()=>{ const url=safeHttpUrl(b.dataset.panicLink); if(url) window.open(url,'_blank','noopener,noreferrer'); }; });
}
