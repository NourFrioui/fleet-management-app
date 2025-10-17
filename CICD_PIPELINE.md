# 🔄 Pipeline CI/CD - Fleet Management

## 📋 Introduction

Ce guide vous aide à mettre en place un pipeline CI/CD complet pour automatiser le déploiement de votre application (Frontend React + Backend NestJS) sur OVH.

**Avantages du CI/CD :**

- ✅ Déploiement automatique à chaque push sur main/production
- ✅ Tests automatiques avant déploiement
- ✅ Rollback facile en cas de problème
- ✅ Historique des déploiements
- ✅ Zero-downtime deployment

**Plateformes supportées :**

- 🟢 **GitHub Actions** (recommandé si vous utilisez GitHub)
- 🟠 **GitLab CI/CD** (si vous utilisez GitLab)
- 🔵 **Scripts manuels** (alternative simple)

---

## 🚀 Option 1 : GitHub Actions (Recommandé)

### Structure du Projet Git

```
fleet-management-app/          # Frontend (Repository principal)
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml
├── src/
├── public/
└── package.json

fleet-management-api/          # Backend (Repository séparé ou même repo)
├── .github/
│   └── workflows/
│       └── deploy-backend.yml
├── src/
└── package.json
```

### 1. Configuration des Secrets GitHub

**Aller dans Settings → Secrets and variables → Actions → New repository secret**

Créer ces secrets :

```
VPS_HOST=51.91.123.45
VPS_USER=ubuntu
VPS_SSH_KEY=(votre clé SSH privée complète)
VPS_BACKEND_PATH=/var/www/fleet-api
VPS_FRONTEND_PATH=/var/www/fleet-frontend
```

### 2. Pipeline Frontend (GitHub Actions)

Créer `.github/workflows/deploy-frontend.yml` :

```yaml
name: Deploy Frontend to OVH

on:
  push:
    branches:
      - main
      - production
  workflow_dispatch: # Permet le déclenchement manuel

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout du code
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      # 3. Installer les dépendances
      - name: Install dependencies
        run: npm ci

      # 4. Linter
      - name: Run linter
        run: npm run lint || true

      # 5. Tests (si vous en avez)
      - name: Run tests
        run: npm test || true

      # 6. Build de production
      - name: Build for production
        env:
          VITE_API_URL: https://api.votredomaine.tn/api/v1
        run: npm run build

      # 7. Afficher la taille du build
      - name: Check build size
        run: du -sh dist/

      # 8. Déployer sur OVH via SSH
      - name: Deploy to OVH VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            echo "🚀 Déploiement du frontend..."

            # Créer un backup de l'ancien build
            sudo cp -r ${{ secrets.VPS_FRONTEND_PATH }} ${{ secrets.VPS_FRONTEND_PATH }}-backup-$(date +%Y%m%d-%H%M%S) || true

            # Nettoyer le dossier de destination
            sudo rm -rf ${{ secrets.VPS_FRONTEND_PATH }}/*

            echo "✅ Ancien build sauvegardé et dossier nettoyé"

      # 9. Copier les fichiers via SCP
      - name: Copy files to VPS
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "dist/*"
          target: "/tmp/fleet-frontend-new"
          strip_components: 1

      # 10. Finaliser le déploiement
      - name: Finalize deployment
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            echo "📦 Déplacement des fichiers..."
            sudo mv /tmp/fleet-frontend-new/* ${{ secrets.VPS_FRONTEND_PATH }}/

            echo "🔐 Configuration des permissions..."
            sudo chown -R www-data:www-data ${{ secrets.VPS_FRONTEND_PATH }}
            sudo chmod -R 755 ${{ secrets.VPS_FRONTEND_PATH }}

            echo "🧹 Nettoyage..."
            sudo rm -rf /tmp/fleet-frontend-new

            echo "✅ Déploiement du frontend terminé avec succès!"

            # Garder seulement les 5 derniers backups
            cd $(dirname ${{ secrets.VPS_FRONTEND_PATH }})
            ls -t fleet-frontend-backup-* 2>/dev/null | tail -n +6 | xargs -r sudo rm -rf

      # 11. Test du déploiement
      - name: Health check
        run: |
          sleep 5
          curl -f https://votredomaine.tn || exit 1
          echo "✅ Frontend accessible!"

      # 12. Notification (optionnel)
      - name: Deployment success notification
        if: success()
        run: |
          echo "✅ Déploiement réussi!"
          echo "🌐 URL: https://votredomaine.tn"
          echo "📅 Date: $(date)"
          echo "🔨 Commit: ${{ github.sha }}"

      - name: Deployment failure notification
        if: failure()
        run: |
          echo "❌ Le déploiement a échoué!"
          echo "🔍 Vérifiez les logs ci-dessus"
```

### 3. Pipeline Backend (GitHub Actions)

Créer `.github/workflows/deploy-backend.yml` :

```yaml
name: Deploy Backend to OVH

on:
  push:
    branches:
      - main
      - production
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout du code
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      # 3. Installer les dépendances
      - name: Install dependencies
        run: npm ci

      # 4. Linter
      - name: Run linter
        run: npm run lint || true

      # 5. Tests
      - name: Run tests
        run: npm test || true

      # 6. Build de production
      - name: Build for production
        run: npm run build

      # 7. Créer un tarball du build
      - name: Create deployment package
        run: |
          tar -czf deployment.tar.gz \
            dist/ \
            package.json \
            package-lock.json \
            node_modules/

      # 8. Upload sur le serveur
      - name: Upload to VPS
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "deployment.tar.gz"
          target: "/tmp/"

      # 9. Déployer sur OVH
      - name: Deploy to OVH VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            echo "🚀 Déploiement du backend..."

            cd ${{ secrets.VPS_BACKEND_PATH }}

            # Backup de l'ancien build
            echo "💾 Création du backup..."
            sudo cp -r dist dist-backup-$(date +%Y%m%d-%H%M%S) || true

            # Extraire le nouveau build
            echo "📦 Extraction du nouveau build..."
            tar -xzf /tmp/deployment.tar.gz

            # Exécuter les migrations
            echo "🗄️  Exécution des migrations..."
            npm run typeorm migration:run || true

            # Redémarrer l'application avec PM2
            echo "♻️  Redémarrage de l'application..."
            pm2 restart fleet-api

            # Attendre que l'app démarre
            sleep 5

            # Vérifier le status
            pm2 status fleet-api

            # Nettoyage
            echo "🧹 Nettoyage..."
            rm -f /tmp/deployment.tar.gz

            # Garder seulement les 5 derniers backups
            ls -t dist-backup-* 2>/dev/null | tail -n +6 | xargs -r rm -rf

            echo "✅ Déploiement du backend terminé avec succès!"

      # 10. Health check
      - name: Backend health check
        run: |
          sleep 10
          curl -f https://api.votredomaine.tn/api/v1/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"test"}' \
            || exit 1
          echo "✅ Backend accessible et API répond!"

      # 11. Vérifier les logs PM2
      - name: Check PM2 logs
        if: failure()
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            echo "📋 Logs PM2 (dernières 50 lignes):"
            pm2 logs fleet-api --lines 50 --nostream

      # 12. Notification
      - name: Deployment success notification
        if: success()
        run: |
          echo "✅ Déploiement réussi!"
          echo "🌐 API URL: https://api.votredomaine.tn"
          echo "📚 Swagger: https://api.votredomaine.tn/api/docs"
          echo "📅 Date: $(date)"
          echo "🔨 Commit: ${{ github.sha }}"
```

### 4. Pipeline Complet (Frontend + Backend)

Si les deux sont dans le même repository, créer `.github/workflows/deploy-full.yml` :

```yaml
name: Deploy Full Stack to OVH

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      # [Même contenu que deploy-backend.yml]
      - name: Deploy Backend
        run: echo "Voir deploy-backend.yml pour le contenu complet"

  deploy-frontend:
    needs: deploy-backend # Attendre que le backend soit déployé
    runs-on: ubuntu-latest
    steps:
      # [Même contenu que deploy-frontend.yml]
      - name: Deploy Frontend
        run: echo "Voir deploy-frontend.yml pour le contenu complet"

  smoke-tests:
    needs: [deploy-backend, deploy-frontend]
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests
        run: |
          echo "🧪 Tests de fumée..."

          # Test frontend
          curl -f https://votredomaine.tn || exit 1

          # Test backend
          curl -f https://api.votredomaine.tn/api/docs || exit 1

          echo "✅ Tous les tests de fumée sont passés!"
```

---

## 🟠 Option 2 : GitLab CI/CD

### 1. Configuration des Variables GitLab

**Aller dans Settings → CI/CD → Variables**

Créer ces variables :

```
VPS_HOST=51.91.123.45
VPS_USER=ubuntu
VPS_SSH_KEY=(votre clé SSH privée)
VPS_BACKEND_PATH=/var/www/fleet-api
VPS_FRONTEND_PATH=/var/www/fleet-frontend
```

### 2. Configuration GitLab CI

Créer `.gitlab-ci.yml` à la racine du projet :

```yaml
# Définir les stages
stages:
  - test
  - build
  - deploy

# Variables globales
variables:
  NODE_VERSION: "20"

# Cache npm
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

# ==================== FRONTEND ====================

# Tests Frontend
test:frontend:
  stage: test
  image: node:20
  only:
    - main
    - production
  script:
    - cd frontend # Adapter selon votre structure
    - npm ci --cache .npm --prefer-offline
    - npm run lint || true
    - npm test || true

# Build Frontend
build:frontend:
  stage: build
  image: node:20
  only:
    - main
    - production
  script:
    - cd frontend
    - npm ci --cache .npm --prefer-offline
    - VITE_API_URL=https://api.votredomaine.tn/api/v1 npm run build
  artifacts:
    paths:
      - frontend/dist/
    expire_in: 1 hour

# Deploy Frontend
deploy:frontend:
  stage: deploy
  image: alpine:latest
  only:
    - main
  dependencies:
    - build:frontend
  before_script:
    - apk add --no-cache openssh-client rsync
    - eval $(ssh-agent -s)
    - echo "$VPS_SSH_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $VPS_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - echo "🚀 Déploiement du frontend..."

    # Créer backup sur le serveur
    - ssh $VPS_USER@$VPS_HOST "sudo cp -r $VPS_FRONTEND_PATH $VPS_FRONTEND_PATH-backup-\$(date +%Y%m%d-%H%M%S) || true"

    # Sync les fichiers
    - rsync -avz --delete frontend/dist/ $VPS_USER@$VPS_HOST:/tmp/fleet-frontend-new/

    # Déplacer les fichiers
    - |
      ssh $VPS_USER@$VPS_HOST << 'EOF'
        sudo rm -rf $VPS_FRONTEND_PATH/*
        sudo mv /tmp/fleet-frontend-new/* $VPS_FRONTEND_PATH/
        sudo chown -R www-data:www-data $VPS_FRONTEND_PATH
        sudo chmod -R 755 $VPS_FRONTEND_PATH
        rm -rf /tmp/fleet-frontend-new
        echo "✅ Frontend déployé!"
      EOF

    # Health check
    - sleep 5
    - wget --spider https://votredomaine.tn || exit 1
    - echo "✅ Frontend accessible!"

# ==================== BACKEND ====================

# Tests Backend
test:backend:
  stage: test
  image: node:20
  only:
    - main
    - production
  script:
    - cd backend # Adapter selon votre structure
    - npm ci --cache .npm --prefer-offline
    - npm run lint || true
    - npm test || true

# Build Backend
build:backend:
  stage: build
  image: node:20
  only:
    - main
    - production
  script:
    - cd backend
    - npm ci --cache .npm --prefer-offline
    - npm run build
    - tar -czf ../backend-deployment.tar.gz dist/ package.json package-lock.json
  artifacts:
    paths:
      - backend-deployment.tar.gz
    expire_in: 1 hour

# Deploy Backend
deploy:backend:
  stage: deploy
  image: alpine:latest
  only:
    - main
  dependencies:
    - build:backend
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$VPS_SSH_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $VPS_HOST >> ~/.ssh/known_hosts
  script:
    - echo "🚀 Déploiement du backend..."

    # Upload du tarball
    - scp backend-deployment.tar.gz $VPS_USER@$VPS_HOST:/tmp/

    # Déployer sur le serveur
    - |
      ssh $VPS_USER@$VPS_HOST << 'EOF'
        cd $VPS_BACKEND_PATH
        
        # Backup
        cp -r dist dist-backup-$(date +%Y%m%d-%H%M%S) || true
        
        # Extraire
        tar -xzf /tmp/backend-deployment.tar.gz
        
        # Migrations
        npm run typeorm migration:run || true
        
        # Redémarrer
        pm2 restart fleet-api
        sleep 5
        pm2 status fleet-api
        
        # Nettoyage
        rm -f /tmp/backend-deployment.tar.gz
        
        echo "✅ Backend déployé!"
      EOF

    # Health check
    - sleep 10
    - wget --spider https://api.votredomaine.tn/api/docs || exit 1
    - echo "✅ Backend accessible!"

# ==================== ROLLBACK ====================

rollback:frontend:
  stage: deploy
  image: alpine:latest
  when: manual
  only:
    - main
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$VPS_SSH_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - ssh-keyscan $VPS_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh $VPS_USER@$VPS_HOST << 'EOF'
        cd $(dirname $VPS_FRONTEND_PATH)
        LAST_BACKUP=$(ls -t fleet-frontend-backup-* 2>/dev/null | head -n 1)
        if [ -z "$LAST_BACKUP" ]; then
          echo "❌ Aucun backup trouvé!"
          exit 1
        fi
        sudo rm -rf $VPS_FRONTEND_PATH/*
        sudo cp -r $LAST_BACKUP/* $VPS_FRONTEND_PATH/
        sudo chown -R www-data:www-data $VPS_FRONTEND_PATH
        echo "✅ Rollback effectué vers $LAST_BACKUP"
      EOF

rollback:backend:
  stage: deploy
  image: alpine:latest
  when: manual
  only:
    - main
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$VPS_SSH_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - ssh-keyscan $VPS_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh $VPS_USER@$VPS_HOST << 'EOF'
        cd $VPS_BACKEND_PATH
        LAST_BACKUP=$(ls -t dist-backup-* 2>/dev/null | head -n 1)
        if [ -z "$LAST_BACKUP" ]; then
          echo "❌ Aucun backup trouvé!"
          exit 1
        fi
        rm -rf dist
        cp -r $LAST_BACKUP dist
        pm2 restart fleet-api
        echo "✅ Rollback effectué vers $LAST_BACKUP"
      EOF
```

---

## 🔵 Option 3 : Scripts de Déploiement Manuel Améliorés

### 1. Script de Déploiement Local

Créer `deploy.sh` à la racine du projet :

```bash
#!/bin/bash

# Configuration
VPS_HOST="51.91.123.45"
VPS_USER="ubuntu"
VPS_BACKEND_PATH="/var/www/fleet-api"
VPS_FRONTEND_PATH="/var/www/fleet-frontend"
API_URL="https://api.votredomaine.tn/api/v1"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonctions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Menu
echo "═══════════════════════════════════════"
echo "  🚀 Fleet Management - Déploiement"
echo "═══════════════════════════════════════"
echo ""
echo "Que voulez-vous déployer ?"
echo ""
echo "1) Frontend uniquement"
echo "2) Backend uniquement"
echo "3) Frontend + Backend"
echo "4) Rollback Frontend"
echo "5) Rollback Backend"
echo "6) Quitter"
echo ""
read -p "Votre choix (1-6) : " choice

case $choice in
    1)
        echo ""
        print_info "Déploiement du Frontend..."

        # Build
        print_info "Build du frontend..."
        VITE_API_URL=$API_URL npm run build

        if [ $? -ne 0 ]; then
            print_error "Erreur lors du build!"
            exit 1
        fi

        # Upload
        print_info "Upload vers le serveur..."
        rsync -avz --progress dist/ $VPS_USER@$VPS_HOST:/tmp/fleet-frontend-new/

        # Déployer
        print_info "Déploiement..."
        ssh $VPS_USER@$VPS_HOST << 'EOF'
            sudo cp -r /var/www/fleet-frontend /var/www/fleet-frontend-backup-$(date +%Y%m%d-%H%M%S)
            sudo rm -rf /var/www/fleet-frontend/*
            sudo mv /tmp/fleet-frontend-new/* /var/www/fleet-frontend/
            sudo chown -R www-data:www-data /var/www/fleet-frontend
            sudo chmod -R 755 /var/www/fleet-frontend
            rm -rf /tmp/fleet-frontend-new
EOF

        print_success "Frontend déployé avec succès!"
        print_info "URL: https://votredomaine.tn"
        ;;

    2)
        echo ""
        print_info "Déploiement du Backend..."

        # Build
        print_info "Build du backend..."
        npm run build

        if [ $? -ne 0 ]; then
            print_error "Erreur lors du build!"
            exit 1
        fi

        # Créer tarball
        print_info "Création du package..."
        tar -czf deployment.tar.gz dist/ package.json package-lock.json

        # Upload
        print_info "Upload vers le serveur..."
        scp deployment.tar.gz $VPS_USER@$VPS_HOST:/tmp/

        # Déployer
        print_info "Déploiement..."
        ssh $VPS_USER@$VPS_HOST << EOF
            cd $VPS_BACKEND_PATH
            cp -r dist dist-backup-\$(date +%Y%m%d-%H%M%S)
            tar -xzf /tmp/deployment.tar.gz
            npm run typeorm migration:run || true
            pm2 restart fleet-api
            sleep 5
            pm2 status fleet-api
            rm -f /tmp/deployment.tar.gz
EOF

        # Nettoyage local
        rm -f deployment.tar.gz

        print_success "Backend déployé avec succès!"
        print_info "API: https://api.votredomaine.tn"
        print_info "Swagger: https://api.votredomaine.tn/api/docs"
        ;;

    3)
        echo ""
        print_info "Déploiement Full Stack..."

        # Backend
        print_info "1/2 - Déploiement du Backend..."
        bash $0 <<< "2"

        # Frontend
        print_info "2/2 - Déploiement du Frontend..."
        bash $0 <<< "1"

        print_success "Déploiement complet terminé!"
        ;;

    4)
        echo ""
        print_info "Rollback Frontend..."
        ssh $VPS_USER@$VPS_HOST << 'EOF'
            cd /var/www
            LAST_BACKUP=$(ls -t fleet-frontend-backup-* 2>/dev/null | head -n 1)
            if [ -z "$LAST_BACKUP" ]; then
                echo "❌ Aucun backup trouvé!"
                exit 1
            fi
            sudo rm -rf fleet-frontend/*
            sudo cp -r $LAST_BACKUP/* fleet-frontend/
            sudo chown -R www-data:www-data fleet-frontend
            echo "✅ Rollback effectué vers $LAST_BACKUP"
EOF
        ;;

    5)
        echo ""
        print_info "Rollback Backend..."
        ssh $VPS_USER@$VPS_HOST << EOF
            cd $VPS_BACKEND_PATH
            LAST_BACKUP=\$(ls -t dist-backup-* 2>/dev/null | head -n 1)
            if [ -z "\$LAST_BACKUP" ]; then
                echo "❌ Aucun backup trouvé!"
                exit 1
            fi
            rm -rf dist
            cp -r \$LAST_BACKUP dist
            pm2 restart fleet-api
            echo "✅ Rollback effectué vers \$LAST_BACKUP"
EOF
        ;;

    6)
        print_info "Au revoir!"
        exit 0
        ;;

    *)
        print_error "Choix invalide!"
        exit 1
        ;;
esac
```

Rendre le script exécutable :

```bash
chmod +x deploy.sh
```

Utiliser le script :

```bash
./deploy.sh
```

---

## 📊 Comparaison des Options

| Critère            | GitHub Actions    | GitLab CI/CD      | Scripts Manuels |
| ------------------ | ----------------- | ----------------- | --------------- |
| **Facilité**       | ⭐⭐⭐⭐          | ⭐⭐⭐⭐          | ⭐⭐⭐          |
| **Automatisation** | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐        | ⭐⭐            |
| **Coût**           | Gratuit (limites) | Gratuit (limites) | Gratuit         |
| **Rollback**       | ⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐        | ⭐⭐⭐          |
| **Tests auto**     | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐        | ⭐              |
| **Notifications**  | ⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐        | ⭐              |

---

## 🔔 Notifications (Optionnel)

### Slack Notifications (GitHub Actions)

Ajouter à la fin de vos workflows :

```yaml
- name: Slack Notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Déploiement ${{ job.status }}
      Branche: ${{ github.ref }}
      Commit: ${{ github.sha }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Discord Notifications

```yaml
- name: Discord Notification
  if: always()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "Déploiement Fleet Management"
```

---

## 🧪 Tests de Déploiement

### Tests E2E Post-Déploiement

Créer `.github/workflows/post-deploy-tests.yml` :

```yaml
name: Post-Deployment Tests

on:
  workflow_run:
    workflows: ["Deploy Full Stack to OVH"]
    types:
      - completed

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Frontend availability test
        run: |
          curl -f https://votredomaine.tn || exit 1

      - name: Backend API test
        run: |
          curl -f https://api.votredomaine.tn/api/docs || exit 1

      - name: Login endpoint test
        run: |
          response=$(curl -s -w "%{http_code}" \
            -X POST https://api.votredomaine.tn/api/v1/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"wrong"}')

          if [[ "${response: -3}" != "401" ]]; then
            echo "❌ Login endpoint ne répond pas correctement"
            exit 1
          fi
          echo "✅ Login endpoint OK"

      - name: SSL certificate test
        run: |
          echo | openssl s_client -servername votredomaine.tn \
            -connect votredomaine.tn:443 2>/dev/null | \
            openssl x509 -noout -dates
```

---

## 📝 Checklist CI/CD

### Setup Initial

- [ ] Repository Git créé (GitHub ou GitLab)
- [ ] Clés SSH générées et ajoutées au serveur
- [ ] Secrets configurés dans le repository
- [ ] Workflows créés (.github/workflows/ ou .gitlab-ci.yml)

### Configuration

- [ ] Variables d'environnement correctes
- [ ] Chemins des dossiers corrects
- [ ] URL de l'API configurée
- [ ] Permissions SSH configurées

### Tests

- [ ] Pipeline déclenché manuellement
- [ ] Build réussi localement
- [ ] Deploy test réussi
- [ ] Health checks passent
- [ ] Rollback testé

### Production

- [ ] Pipeline automatique sur push main
- [ ] Notifications configurées
- [ ] Backups automatiques vérifiés
- [ ] Monitoring actif
- [ ] Documentation à jour

---

## 🆘 Troubleshooting

### Erreur : Permission denied (publickey)

```bash
# Vérifier que la clé SSH est correcte
ssh-keygen -y -f ~/.ssh/id_rsa

# Vérifier que la clé est bien dans authorized_keys du serveur
ssh ubuntu@51.91.123.45 "cat ~/.ssh/authorized_keys"
```

### Erreur : PM2 restart failed

```bash
# Se connecter au serveur et vérifier PM2
ssh ubuntu@51.91.123.45
pm2 logs fleet-api
pm2 restart fleet-api --update-env
```

### Erreur : Build failed

```bash
# Vérifier les dépendances localement
npm ci
npm run build

# Vérifier les variables d'environnement
echo $VITE_API_URL
```

---

## 🎯 Bonnes Pratiques

1. **Branches**

   - `main` → Déploiement automatique en production
   - `develop` → Déploiement sur staging (optionnel)
   - `feature/*` → Pas de déploiement automatique

2. **Tags**

   - Créer des tags pour chaque release : `v1.0.0`, `v1.1.0`, etc.
   - Déployer à partir des tags en production

3. **Rollback**

   - Toujours faire un backup avant le déploiement
   - Garder les 5-10 derniers backups
   - Avoir un plan de rollback rapide

4. **Monitoring**

   - Configurer des alertes en cas d'échec
   - Vérifier les logs après chaque déploiement
   - Health checks automatiques

5. **Sécurité**
   - Ne jamais commit les secrets
   - Utiliser des secrets chiffrés
   - Limiter les accès SSH

---

**🎉 Votre pipeline CI/CD est maintenant prêt !**

**Prochaines étapes :**

1. Choisir votre plateforme (GitHub Actions recommandé)
2. Configurer les secrets
3. Créer les workflows
4. Tester le déploiement
5. Automatiser complètement

**Temps estimé de mise en place : 2-3 heures**
