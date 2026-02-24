# 🏥 PediaLink - Pediatric Nephrology Platform

Plateforme de suivi pédiatrique pour la néphrologie avec architecture microservices.

## 📋 Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Équipe et branches](#équipe-et-branches)
- [Contribution](#contribution)

## 🏗️ Architecture

Architecture microservices avec Spring Cloud:

```
├── eureka-server          # Service Discovery (port 8761)
├── config-server          # Configuration centralisée (port 8888)
├── api-gateway            # Point d'entrée unique (port 8080)
├── auth-service           # Authentification & Notifications (port 8081)
├── prescription-service   # Gestion des prescriptions (port 8082)
├── dossiermedical-service # Dossiers médicaux (port 8084)
└── treatment-monitoring   # Suivi des traitements (port 8085)
```

## 🛠️ Technologies

### Backend
- Java 17
- Spring Boot 3.2.x
- Spring Cloud 2023.0.x
- MongoDB Atlas
- OpenFeign (communication inter-services)
- JWT (authentification)
- Docker & Docker Compose

### Frontend
- Angular (à venir)

## 📦 Prérequis

- JDK 17+
- Maven 3.8+
- Docker Desktop
- MongoDB Atlas account
- Git

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/oumaymahannachi/pediatric-nephrology-platform.git
cd pediatric-nephrology-platform
```

### 2. Compiler les services

```bash
cd backend
mvn clean package -DskipTests
```

### 3. Lancer avec Docker

```bash
docker-compose up -d
```

### 4. Accéder aux services

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- Prescription Service: http://localhost:8082
- Dossier Medical Service: http://localhost:8084

## 📁 Structure du projet

```
pedialink/
├── backend/
│   ├── eureka-server/
│   ├── config-server/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── prescription-service/
│   ├── dossiermedical-service/
│   ├── treatment-monitoring-service/
│   ├── docker-compose.yml
│   └── pom.xml
├── frontend/ (à venir)
├── .gitignore
└── README.md
```

## 👥 Équipe et branches

| Membre | Service | Branche |
|--------|---------|---------|
| Fatma | dossiermedical-service | `feature/fatma-dossiermedical` |
| [Nom] | prescription-service | `feature/[nom]-prescription` |
| [Nom] | auth-service | `feature/[nom]-auth` |
| [Nom] | treatment-monitoring | `feature/[nom]-treatment` |

## 🤝 Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails sur notre workflow Git.

### Workflow rapide

```bash
# Créer votre branche
git checkout -b feature/[votre-nom]-[service]

# Faire vos modifications
git add .
git commit -m "feat: description de votre feature"

# Pousser votre branche
git push origin feature/[votre-nom]-[service]
```

## 📝 Conventions de commit

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

## 📄 Licence

Ce projet est sous licence MIT.

## 📧 Contact

Pour toute question, contactez l'équipe de développement.
