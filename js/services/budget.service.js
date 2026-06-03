export function spentForOccasion(ideas){ return ideas.filter(i=>['achete','emballe','offert'].includes(i.status)).reduce((sum,i)=>sum+(Number(i.estimatedPrice)||0),0); }
export function spentForPerson(ideas, personId){ return spentForOccasion(ideas.filter(i=>i.personId===personId)); }
