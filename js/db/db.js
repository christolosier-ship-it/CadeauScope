import { DB } from '../config.js';
import { createSchema } from './schema.js';
let dbPromise;
export function openDb(){ if(dbPromise) return dbPromise; dbPromise = new Promise((resolve,reject)=>{ const request=indexedDB.open(DB.name, DB.version); request.onupgradeneeded=()=>createSchema(request.result); request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); }); return dbPromise; }
export async function tx(store, mode='readonly'){ const db=await openDb(); return db.transaction(store,mode).objectStore(store); }
export async function clearDb(){ const db=await openDb(); const stores=[...db.objectStoreNames]; await Promise.all(stores.map(name=>new Promise((res,rej)=>{ const req=db.transaction(name,'readwrite').objectStore(name).clear(); req.onsuccess=()=>res(); req.onerror=()=>rej(req.error); }))); }
