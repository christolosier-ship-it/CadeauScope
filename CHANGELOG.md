# Changelog

## 1.0.2 - 2026-06-04

- Simplification UX : une idée est désormais créée pour une personne, sans choix d’occasion dans le flux principal.
- Réduction des états visibles aux idées disponibles, cadeaux offerts et action secondaire “Ne plus proposer”.
- Normalisation douce des anciens statuts `a_acheter`, `achete` et `emballe` comme idées actives.
- Mode Panique simplifié autour de “Pour qui ?”, “Budget max” et “Élargir la recherche”.
- Les événements ressortent les idées disponibles des personnes concernées au lieu de dépendre de `occasionId`.
- Accueil, cartes idées, détail idée, filtres et navigation basse allégés.
- Import/export conservé, sans export des photos, avec normalisation des anciennes idées importées.

## 1.0.1 - 2026-06-04

- Ajout de la modification complète des idées, avec conservation des champs existants et remplacement optionnel de photo locale.
- Centralisation des actions de cartes d’idées et confirmation obligatoire avant tout passage au statut `Offert`.
- Stockage réel des photos utilisateur dans IndexedDB, sans export JSON des blobs ni des `photoId`.
- Correction de la capture rapide pour les occasions manuelles et les occasions préremplies.
- Renforcement de l’échappement HTML, de la validation des liens et de la validation numérique anti-`NaN`.
- Correction du formulaire personne pour conserver toutes les préférences à l’édition.

## 1.0.0 - 2026-06-03

- Création de CadeauScope en PWA offline-first vanilla JS.
- Ajout des stores IndexedDB `people`, `ideas`, `occasions`, `history`, `categories`, `photos` et `settings`.
- Ajout des écrans Welcome, Accueil, Capture rapide, Idées, Détail idée, Personnes, Détail personne, Occasions, Détail occasion, Mode Panique Cadeau et Réglages.
- Ajout du Mode Panique Cadeau avec scoring local et section Hors budget.
- Ajout de l’export/import JSON sans photos.
- Ajout des thèmes automatique, clair et sombre.
- Ajout du Service Worker avec cache statique robuste et icônes PNG optionnelles non générées.
