export const STORES = ['people','ideas','occasions','history','categories','photos','settings'];
export function createSchema(db) {
  if (!db.objectStoreNames.contains('people')) { const s=db.createObjectStore('people',{keyPath:'id'}); s.createIndex('name','name'); s.createIndex('archived','archived'); }
  if (!db.objectStoreNames.contains('ideas')) { const s=db.createObjectStore('ideas',{keyPath:'id'}); s.createIndex('personId','personId'); s.createIndex('status','status'); s.createIndex('categoryId','categoryId'); s.createIndex('occasionId','occasionId'); }
  if (!db.objectStoreNames.contains('occasions')) db.createObjectStore('occasions',{keyPath:'id'});
  if (!db.objectStoreNames.contains('history')) { const s=db.createObjectStore('history',{keyPath:'id'}); s.createIndex('personId','personId'); s.createIndex('ideaId','ideaId'); }
  if (!db.objectStoreNames.contains('categories')) db.createObjectStore('categories',{keyPath:'id'});
  if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos',{keyPath:'id'});
  if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings',{keyPath:'id'});
}
