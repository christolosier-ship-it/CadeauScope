import { openDb } from './db.js';
export function repo(storeName){
  const run = async (mode, fn) => { const db=await openDb(); return new Promise((resolve,reject)=>{ const t=db.transaction(storeName,mode); const s=t.objectStore(storeName); let out; t.oncomplete=()=>resolve(out); t.onerror=()=>reject(t.error); out=fn(s); }); };
  const req = r => new Promise((resolve,reject)=>{ r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error); });
  return { all: async()=> req((await openDb()).transaction(storeName).objectStore(storeName).getAll()), get: async id=> req((await openDb()).transaction(storeName).objectStore(storeName).get(id)), put: item=>run('readwrite',s=>s.put(item)), add: item=>run('readwrite',s=>s.add(item)), delete: id=>run('readwrite',s=>s.delete(id)), clear:()=>run('readwrite',s=>s.clear()) };
}
export const repositories = { people:repo('people'), ideas:repo('ideas'), occasions:repo('occasions'), history:repo('history'), categories:repo('categories'), photos:repo('photos'), settings:repo('settings') };
