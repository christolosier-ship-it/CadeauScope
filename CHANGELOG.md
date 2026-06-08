# Changelog

## 1.0.5 - 2026-06-08

- Migration legacy de Noël exécutée une seule fois, avec neutralisation de `christmasEnabled`.
- Dates du jour basées sur le fuseau local et anniversaires du 29 février reportés au prochain vrai 29 février.
- Filtres Personnes et Événements clarifiés, avec accès aux personnes archivées et événements masqués.
- Mode Panique : les idées sans prix restent éligibles avec un léger malus au lieu d’être hors budget.
- Suppression des événements manuels : nettoyage des anciens `occasionId`/`occasionMode` sans supprimer les idées.
- Thème appliqué immédiatement, import JSON invalide géré proprement, styles d’inputs et grille KPI harmonisés.

## 1.0.4 - 2026-06-04

- Suppression de Noël dans les fiches personnes : l’événement Noël devient la seule source de vérité, avec migration douce des anciens `christmasEnabled: true`.
- Suppression de la case “Année connue” et simplification du formulaire personne autour du nom, de la relation, de l’anniversaire et des notes.
- Passage des dates visibles en français (`JJ-MM-AAAA`) et des anniversaires en `JJ-MM`, avec compatibilité des anciennes valeurs ISO.
- Consolidation des anniversaires automatiques `birthday_[personId]` sans dépendre de `birthdayHasYear`.
- Clarification du budget événement comme budget indicatif, sans faux calcul de dépense événementielle.
- Accueil recentré sur les événements, avec une section utile pour les personnes sans idée dans les événements proches.
- Filtres personnes simplifiés en “Toutes”, “Avec idées” et “Sans idée”.
- Réactivation explicite des événements masqués et retrait de l’action visible “Clôturer”.

## 1.0.3 - 2026-06-04

- Retour d’Événements dans la navigation principale.
- Ajout des événements classiques français préinstallés, avec dates fixes ou calculées et sans liaison automatique de toutes les personnes.
- Ajout de la gestion des personnes liées à chaque événement et affichage des idées actives de ces personnes uniquement.
- Synchronisation automatique des anniversaires depuis les personnes, sans doublon et masquée si la personne est archivée ou sans anniversaire.
- Accueil recentré sur “Événements à préparer” avec personnes et idées disponibles.
- Mode Panique depuis un événement limité aux personnes liées, sans utiliser les anciennes associations `occasionId`.
- Import/export normalise les événements, conserve les personnes liées et recrée les événements classiques manquants.

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
