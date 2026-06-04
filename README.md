# CadeauScope 1.0.3

> “Fini les cadeaux trouvés à 17h42 la veille.”

CadeauScope est une PWA mobile-first, offline-first et sans backend pour capturer, organiser et retrouver les idées cadeaux de ses proches. L’application fonctionne en JavaScript vanilla, modules ES, IndexedDB et Service Worker, sans framework, sans compte, sans cloud et sans publicité.

## Fonctionnalités

- Capture rapide centrée sur une personne, une idée, un prix approximatif et une note ou un lien.
- Événements liés aux personnes concernées : les idées ne sont plus classées par occasion.
- États simplifiés : idée disponible, cadeau offert, ou idée à ne plus proposer.
- Mode Panique Cadeau simplifié pour retrouver vite une idée par personne et budget.
- PWA installable compatible GitHub Pages et iPhone Safari.
- Données persistées localement dans IndexedDB (`cadeauscope_db`, version 1).
- Export/import JSON sans photos.
- Thèmes automatique, clair et sombre.

## Installation locale

Aucun build n’est nécessaire. Servez simplement le dossier avec un serveur statique :

```bash
python3 -m http.server 8080
```

Ouvrez ensuite `http://localhost:8080`.

> Évitez d’ouvrir `index.html` directement en `file://` : les modules ES et le Service Worker exigent un contexte HTTP(S).

## Déploiement GitHub Pages

1. Poussez ce dépôt sur GitHub.
2. Dans **Settings → Pages**, choisissez la branche et le dossier racine.
3. Publiez. L’application utilise des chemins relatifs (`./`) et fonctionne depuis une URL GitHub Pages.

## Structure des fichiers

- `index.html` : shell HTML PWA.
- `manifest.json` : manifeste installable.
- `service-worker.js` : cache statique offline-first robuste.
- `css/` : variables, base, layout, composants, écrans, thèmes et responsive.
- `js/db/` : IndexedDB, schéma, seed et repositories.
- `js/models/` : factories de modèles.
- `js/services/` : logique métier, validation, budget, panique, import/export.
- `js/ui/` : DOM, rendus, navigation, toasts, modales, emojis.
- `js/screens/` : écrans principaux.
- `js/tests/` : tests Node simples et checklist manuelle.
- `assets/icons`, `assets/images`, `assets/screenshots` : dossiers réservés, contenant uniquement `.gitkeep` dans cette génération.

## Données stockées localement

IndexedDB contient les stores suivants :

- `people`
- `ideas`
- `occasions`
- `history`
- `categories`
- `photos`
- `settings`

Le store `photos` est prévu pour les images ajoutées par l’utilisateur depuis l’application. Aucune photo n’est fournie dans le projet généré.

## Fonctionnement offline

Le Service Worker met en cache les fichiers essentiels HTML, CSS, JS et le manifeste. Les chemins d’icônes PNG sont tentés en cache optionnel : s’ils sont absents, l’installation du Service Worker ne casse pas l’application.

## Import/export JSON

L’export contient :

```json
{
  "app": "CadeauScope",
  "schemaVersion": 1,
  "appVersion": "1.0.3",
  "exportedAt": "...",
  "people": [],
  "ideas": [],
  "occasions": [],
  "history": [],
  "categories": [],
  "settings": {}
}
```

Les photos sont exclues en V1. L’import remplace toutes les données actuelles après confirmation forte, nettoie les références `photoId` et normalise les anciens statuts avancés.

## Icônes PNG à ajouter manuellement

**Important : Codex ne doit pas créer d’images PNG dans ce projet.** Cette génération ne contient aucun PNG, JPG, JPEG, WEBP, image binaire ou image base64.

Pour finaliser l’installabilité visuelle de la PWA, ajoutez manuellement ces fichiers dans GitHub :

- `assets/icons/icon-192.png`
- `assets/icons/icon-512.png`
- `assets/icons/apple-touch-icon.png`

Le manifeste référence déjà ces chemins. L’application reste utilisable même si ces fichiers ne sont pas encore présents.

## Limites V1

- Interface volontairement emoji-first ; aucun asset graphique n’est généré par le projet.
- Photos stockables localement mais non exportées.
- Gestion des catégories personnalisées prête côté données, interface minimale.
- Pas de synchronisation multi-appareil.
- Pas de backend, pas de compte, pas de cloud.

## Vérifications

```bash
npm test
find . -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.ico' \) -not -path './.git/*' -print
```

La deuxième commande ne doit rien afficher après génération.
