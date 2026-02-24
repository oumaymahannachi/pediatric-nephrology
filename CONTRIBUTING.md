# 🤝 Guide de contribution - PediaLink

## 📋 Workflow Git

### 1. Configuration initiale (une seule fois)

```bash
# Cloner le repository
git clone https://github.com/oumaymahannachi/pediatric-nephrology-platform.git
cd pediatric-nephrology-platform

# Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### 2. Créer votre branche de travail

```bash
# Toujours partir de main à jour
git checkout main
git pull origin main

# Créer votre branche personnelle
git checkout -b feature/[votre-nom]-[service]

# Exemples:
# git checkout -b feature/fatma-dossiermedical
# git checkout -b feature/ahmed-prescription
# git checkout -b feature/sara-auth
```

### 3. Travailler sur votre branche

```bash
# Vérifier sur quelle branche vous êtes
git branch

# Faire vos modifications...

# Voir les fichiers modifiés
git status

# Ajouter vos modifications
git add .

# Ou ajouter des fichiers spécifiques
git add backend/dossiermedical-service/src/...

# Commiter avec un message clair
git commit -m "feat: ajout de la fonctionnalité X"
```

### 4. Pousser votre travail

```bash
# Première fois
git push -u origin feature/[votre-nom]-[service]

# Les fois suivantes
git push
```

### 5. Mettre à jour votre branche avec main

```bash
# Récupérer les dernières modifications de main
git checkout main
git pull origin main

# Retourner sur votre branche
git checkout feature/[votre-nom]-[service]

# Fusionner les modifications de main
git merge main

# Résoudre les conflits si nécessaire
# Puis pousser
git push
```

## 📝 Conventions de commit

Utilisez des messages de commit clairs et descriptifs:

### Format
```
<type>: <description courte>

[corps optionnel]

[footer optionnel]
```

### Types de commit

- **feat**: Nouvelle fonctionnalité
  ```bash
  git commit -m "feat: ajout de l'API de création de dossier médical"
  ```

- **fix**: Correction de bug
  ```bash
  git commit -m "fix: correction de l'erreur de validation du formulaire"
  ```

- **docs**: Documentation
  ```bash
  git commit -m "docs: mise à jour du README avec les instructions Docker"
  ```

- **refactor**: Refactoring du code
  ```bash
  git commit -m "refactor: amélioration de la structure du service"
  ```

- **test**: Ajout ou modification de tests
  ```bash
  git commit -m "test: ajout des tests unitaires pour le controller"
  ```

- **chore**: Tâches de maintenance
  ```bash
  git commit -m "chore: mise à jour des dépendances Maven"
  ```

- **style**: Formatage du code
  ```bash
  git commit -m "style: formatage du code selon les conventions"
  ```

## 🔄 Workflow quotidien

### Début de journée
```bash
# Mettre à jour votre branche
git checkout feature/[votre-nom]-[service]
git pull origin feature/[votre-nom]-[service]

# Récupérer les mises à jour de main
git checkout main
git pull origin main
git checkout feature/[votre-nom]-[service]
git merge main
```

### Pendant le travail
```bash
# Commiter régulièrement (toutes les 1-2h)
git add .
git commit -m "feat: description de ce que vous avez fait"
git push
```

### Fin de journée
```bash
# Pousser tout votre travail
git add .
git commit -m "chore: sauvegarde fin de journée"
git push
```

## 🚫 À éviter

❌ Ne jamais commiter directement sur `main`
❌ Ne pas pousser de fichiers compilés (target/, node_modules/)
❌ Ne pas pousser de fichiers de configuration locale (.env, application-local.yml)
❌ Ne pas faire de commits trop gros (diviser en petits commits logiques)
❌ Ne pas utiliser `git push --force` sauf si vous savez ce que vous faites

## ✅ Bonnes pratiques

✔️ Commiter souvent avec des messages clairs
✔️ Tester votre code avant de commiter
✔️ Garder votre branche à jour avec main
✔️ Demander de l'aide en cas de conflit Git
✔️ Faire des Pull Requests pour fusionner dans main

## 🆘 Commandes utiles

```bash
# Voir l'historique des commits
git log --oneline

# Voir les différences avant de commiter
git diff

# Annuler les modifications non commitées
git checkout -- <fichier>

# Voir toutes les branches
git branch -a

# Supprimer une branche locale
git branch -d <nom-branche>

# Voir les fichiers ignorés par .gitignore
git status --ignored
```

## 📞 Besoin d'aide?

Si vous rencontrez des problèmes avec Git:
1. Ne paniquez pas!
2. Demandez de l'aide à l'équipe
3. N'utilisez pas `git push --force` sans comprendre

## 🎯 Checklist avant de pousser

- [ ] Mon code compile sans erreur
- [ ] J'ai testé mes modifications
- [ ] J'ai ajouté/mis à jour la documentation si nécessaire
- [ ] Mon message de commit est clair
- [ ] Je n'ai pas de fichiers sensibles dans mon commit
- [ ] Ma branche est à jour avec main
