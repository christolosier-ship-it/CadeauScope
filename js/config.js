export const APP = { name: 'CadeauScope', version: '1.0.0', slogan: 'Fini les cadeaux trouvés à 17h42 la veille.' };
export const DB = { name: 'cadeauscope_db', version: 1 };
export const STATUSES = {
  idee: 'Idée', a_acheter: 'À acheter', achete: 'Acheté', emballe: 'Emballé', offert: 'Offert', abandonne: 'Abandonné'
};
export const STATUS_FLOW = ['idee','a_acheter','achete','emballe','offert'];
export const INTEREST_LEVELS = { 1: '⭐ À tester', 2: '⭐⭐ Bonne idée', 3: '⭐⭐⭐ Très bonne idée', 4: '🔥 Idée pépite' };
export const RELATIONS = { famille:'Famille', ami:'Ami', conjoint:'Conjoint', enfant:'Enfant', collegue:'Collègue', autre:'Autre' };
export const OCCASION_TYPES = { birthday:'Anniversaire', christmas:'Noël', fete_meres:'Fête des mères', fete_peres:'Fête des pères', saint_valentin:'Saint-Valentin', mariage:'Mariage', naissance:'Naissance', cremaillere:'Crémaillère', depart_retraite:'Départ retraite', autre:'Autre' };
export const OCCASION_STATUS = { a_venir:'À venir', en_preparation:'En préparation', terminee:'Terminée', archivee:'Archivée' };
export const REACTIONS = { adore:'😍 Adoré', apprecie:'🙂 Apprécié', correct:'😐 Correct', bof:'😬 Bof', echec_total:'💀 Échec total' };
