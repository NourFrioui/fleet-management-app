# 🚀 Guide de Déploiement OVH - Fleet Management

## 📋 Introduction

Ce guide vous accompagne pour déployer votre application complète (Frontend React + Backend NestJS) sur un VPS OVH.

**Ce que vous aurez à la fin :**

- ✅ Backend NestJS tournant sur https://api.votredomaine.tn
- ✅ Frontend React accessible sur https://votredomaine.tn
- ✅ Base de données PostgreSQL sécurisée
- ✅ Certificats SSL gratuits (Let's Encrypt)
- ✅ Application en production avec PM2
- ✅ Scripts de déploiement automatisés

---

## 🛒 Étape 1 : Commander un VPS OVH

### Recommandations VPS

Pour cette application, un **VPS Starter** ou **VPS Value** suffit :

| Offre         | RAM  | CPU      | Stockage   | Prix/mois | Recommandé    |
| ------------- | ---- | -------- | ---------- | --------- | ------------- |
| VPS Starter   | 2 GB | 1 vCore  | 20 GB SSD  | ~4€       | ✅ Démarrage  |
| VPS Value     | 4 GB | 2 vCores | 80 GB SSD  | ~8€       | ⭐ Recommandé |
| VPS Essential | 8 GB | 4 vCores | 160 GB SSD | ~16€      | Production    |

### Commander le VPS

1. Aller sur [OVH Cloud](https://www.ovhcloud.com/fr-tn/vps/)
2. Choisir "VPS Value" (recommandé)
3. Sélectionner **Ubuntu 22.04 LTS** comme système d'exploitation
4. Commander et attendre l'email de confirmation avec :
   - IP du serveur (ex: 51.91.123.45)
   - Login SSH (généralement `ubuntu`)
   - Mot de passe root ou clé SSH

---

## 🌐 Étape 2 : Configurer le Domaine

### Si vous avez un domaine chez OVH

1. Aller dans **Web Cloud** → **Noms de domaine**
2. Cliquer sur votre domaine
3. Onglet **Zone DNS**
4. Ajouter ces enregistrements :

```
Type A   | Nom: @            | Cible: 51.91.123.45 (IP de votre VPS)
Type A   | Nom: api          | Cible: 51.91.123.45 (IP de votre VPS)
Type A   | Nom: www          | Cible: 51.91.123.45 (IP de votre VPS)
```

### Si vous n'avez pas de domaine

Vous pouvez :

- Acheter un domaine .tn chez OVH (~20 TND/an)
- Utiliser un sous-domaine gratuit (pour les tests)
- Utiliser directement l'IP (non recommandé pour la production)

**Note :** La propagation DNS peut prendre 1-24h.

---

## 🔧 Étape 3 : Configuration Initiale du Serveur

### 1. Se connecter en SSH

```bash
# Depuis votre terminal local
ssh ubuntu@51.91.123.45
# Ou si vous avez une clé SSH
ssh -i ~/.ssh/id_rsa ubuntu@51.91.123.45
```

### 2. Mettre à jour le système

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Installer les dépendances nécessaires

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Nginx
sudo apt install -y nginx

# Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# Git
sudo apt install -y git

# PM2 (Process Manager)
sudo npm install -g pm2

# NestJS CLI
sudo npm install -g @nestjs/cli
```

### 4. Vérifier les installations

```bash
node --version    # v20.x.x
npm --version     # 10.x.x
psql --version    # PostgreSQL 14.x
nginx -v          # nginx/1.x.x
pm2 --version     # 5.x.x
```

---

## 🗄️ Étape 4 : Configuration PostgreSQL

### 1. Créer un utilisateur PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter :
CREATE USER fleet_user WITH PASSWORD 'VotreMotDePasseSecurise123!';
CREATE DATABASE fleet_management OWNER fleet_user;
GRANT ALL PRIVILEGES ON DATABASE fleet_management TO fleet_user;

# Quitter psql
\q
```

### 2. Configurer PostgreSQL pour accepter les connexions

```bash
# Éditer pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ajouter cette ligne après les autres règles :
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   fleet_management fleet_user                              md5

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### 3. Tester la connexion

```bash
psql -U fleet_user -d fleet_management -h localhost
# Entrer le mot de passe
# Si ça fonctionne, taper \q pour quitter
```

---

## 🔙 Étape 5 : Déploiement du Backend (NestJS)

### 1. Cloner le projet

```bash
# Créer un dossier pour l'application
cd /var/www
sudo mkdir fleet-api
sudo chown -R $USER:$USER fleet-api
cd fleet-api

# Cloner le backend depuis Git (adapter selon votre dépôt)
git clone https://github.com/votre-username/fleet-management-api.git .

# Ou copier les fichiers depuis votre machine locale
# scp -r /path/to/backend ubuntu@51.91.123.45:/var/www/fleet-api/
```

### 2. Créer le fichier .env

```bash
nano .env
```

Contenu du `.env` :

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=fleet_user
DATABASE_PASSWORD=VotreMotDePasseSecurise123!
DATABASE_NAME=fleet_management

# JWT
JWT_SECRET=votre_super_secret_jwt_changez_moi_en_production_xyz123
JWT_EXPIRATION=3600
REFRESH_TOKEN_SECRET=votre_refresh_token_secret_changez_moi_xyz456
REFRESH_TOKEN_EXPIRATION=604800

# App
PORT=8000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://votredomaine.tn,https://www.votredomaine.tn

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=./uploads
```

**Important :** Remplacez tous les secrets et mots de passe !

### 3. Installer les dépendances et build

```bash
npm install
npm run build
```

### 4. Créer le dossier uploads

```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. Exécuter les migrations (si vous en avez)

```bash
npm run typeorm migration:run
```

### 6. Créer l'utilisateur admin (seed)

```bash
# Créer un script seed si vous n'en avez pas
node dist/database/seeds/create-admin.seed.js
```

### 7. Démarrer avec PM2

```bash
# Démarrer l'application
pm2 start dist/main.js --name fleet-api

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Copier/coller la commande suggérée et l'exécuter
```

### 8. Vérifier que ça fonctionne

```bash
pm2 status
pm2 logs fleet-api

# Tester l'API
curl http://localhost:8000/api/v1/auth/login
```

---

## 🎨 Étape 6 : Déploiement du Frontend (React)

### 1. Build du frontend sur votre machine locale

```bash
# Sur votre machine locale, dans le dossier du frontend
cd /home/nour/fleet-management-app

# Configurer l'URL de l'API
echo "VITE_API_URL=https://api.votredomaine.tn/api/v1" > .env.production

# Build
npm run build

# Le dossier dist/ contient les fichiers statiques
```

### 2. Copier les fichiers sur le serveur

```bash
# Sur votre machine locale
scp -r dist/* ubuntu@51.91.123.45:/tmp/fleet-frontend/

# Sur le serveur
ssh ubuntu@51.91.123.45
sudo mkdir -p /var/www/fleet-frontend
sudo mv /tmp/fleet-frontend/* /var/www/fleet-frontend/
sudo chown -R www-data:www-data /var/www/fleet-frontend
```

**Alternative (plus simple) :** Créer un dépôt Git, push le code, et git clone sur le serveur.

---

## 🌐 Étape 7 : Configuration Nginx

### 1. Créer la configuration Nginx pour l'API

```bash
sudo nano /etc/nginx/sites-available/fleet-api
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.votredomaine.tn;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Créer la configuration Nginx pour le Frontend

```bash
sudo nano /etc/nginx/sites-available/fleet-frontend
```

Contenu :

```nginx
server {
    listen 80;
    server_name votredomaine.tn www.votredomaine.tn;

    root /var/www/fleet-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compression gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### 3. Activer les configurations

```bash
# Créer des liens symboliques
sudo ln -s /etc/nginx/sites-available/fleet-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/fleet-frontend /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 4. Vérifier que ça fonctionne

```bash
# Ouvrir dans votre navigateur
http://votredomaine.tn
http://api.votredomaine.tn/api/docs  # Swagger
```

---

## 🔒 Étape 8 : Installer les Certificats SSL (HTTPS)

### 1. Installer Certbot

```bash
# Déjà installé à l'étape 3, mais pour vérifier :
certbot --version
```

### 2. Obtenir les certificats SSL

```bash
# Pour le frontend
sudo certbot --nginx -d votredomaine.tn -d www.votredomaine.tn

# Pour l'API
sudo certbot --nginx -d api.votredomaine.tn
```

Suivre les instructions :

- Entrer votre email
- Accepter les termes
- Choisir si vous voulez rediriger HTTP → HTTPS (recommandé : Oui)

### 3. Vérifier le renouvellement automatique

```bash
# Certbot configure automatiquement le renouvellement
# Tester le renouvellement (dry-run)
sudo certbot renew --dry-run
```

### 4. Vérifier HTTPS

Ouvrir dans le navigateur :

- https://votredomaine.tn ✅
- https://api.votredomaine.tn ✅
- https://api.votredomaine.tn/api/docs ✅ (Swagger)

---

## 🔥 Étape 9 : Configuration du Firewall

```bash
# Installer UFW (Uncomplicated Firewall)
sudo apt install -y ufw

# Autoriser SSH
sudo ufw allow OpenSSH

# Autoriser HTTP et HTTPS
sudo ufw allow 'Nginx Full'

# Activer le firewall
sudo ufw enable

# Vérifier le status
sudo ufw status
```

---

## 📊 Étape 10 : Monitoring et Logs

### PM2 Monitoring

```bash
# Voir les logs en temps réel
pm2 logs fleet-api

# Voir les logs spécifiques
pm2 logs fleet-api --lines 100

# Voir les métriques
pm2 monit

# Voir le status
pm2 status
```

### Nginx Logs

```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🔄 Scripts de Déploiement Automatisés

### Script de déploiement Backend

Créer `deploy-backend.sh` sur votre serveur :

```bash
#!/bin/bash

echo "🚀 Déploiement du backend Fleet Management..."

cd /var/www/fleet-api

# Pull les dernières modifications
echo "📥 Pull des modifications..."
git pull origin main

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build
echo "🔨 Build de l'application..."
npm run build

# Exécuter les migrations
echo "🗄️  Exécution des migrations..."
npm run typeorm migration:run

# Redémarrer PM2
echo "♻️  Redémarrage de l'application..."
pm2 restart fleet-api

echo "✅ Déploiement terminé !"
pm2 status
```

### Script de déploiement Frontend

Créer `deploy-frontend.sh` sur votre machine locale :

```bash
#!/bin/bash

echo "🚀 Déploiement du frontend Fleet Management..."

# Build local
echo "🔨 Build du frontend..."
npm run build

# Upload vers le serveur
echo "📤 Upload vers le serveur..."
scp -r dist/* ubuntu@51.91.123.45:/tmp/fleet-frontend-new/

# Sur le serveur, remplacer les fichiers
echo "♻️  Remplacement des fichiers..."
ssh ubuntu@51.91.123.45 << 'EOF'
sudo rm -rf /var/www/fleet-frontend/*
sudo mv /tmp/fleet-frontend-new/* /var/www/fleet-frontend/
sudo chown -R www-data:www-data /var/www/fleet-frontend
rm -rf /tmp/fleet-frontend-new
EOF

echo "✅ Déploiement terminé !"
```

Rendre les scripts exécutables :

```bash
chmod +x deploy-backend.sh
chmod +x deploy-frontend.sh
```

---

## 🔐 Sécurité Renforcée

### 1. Changer le port SSH (optionnel mais recommandé)

```bash
sudo nano /etc/ssh/sshd_config

# Changer la ligne :
Port 22
# En :
Port 2222

# Redémarrer SSH
sudo systemctl restart sshd

# Ne pas oublier d'autoriser le nouveau port dans UFW
sudo ufw allow 2222/tcp
```

### 2. Désactiver l'authentification par mot de passe SSH

```bash
# Utiliser uniquement les clés SSH
sudo nano /etc/ssh/sshd_config

# Modifier :
PasswordAuthentication no
PubkeyAuthentication yes

# Redémarrer SSH
sudo systemctl restart sshd
```

### 3. Installer Fail2Ban (protection contre brute-force)

```bash
sudo apt install -y fail2ban

# Démarrer et activer
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 4. Configurer les backups automatiques

```bash
# Créer un script de backup
sudo nano /usr/local/bin/backup-fleet.sh
```

Contenu :

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/fleet"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U fleet_user -h localhost fleet_management > $BACKUP_DIR/db-$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz /var/www/fleet-api/uploads

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ Backup créé : $DATE"
```

```bash
# Rendre exécutable
sudo chmod +x /usr/local/bin/backup-fleet.sh

# Ajouter une tâche cron (tous les jours à 2h du matin)
sudo crontab -e

# Ajouter cette ligne :
0 2 * * * /usr/local/bin/backup-fleet.sh >> /var/log/fleet-backup.log 2>&1
```

---

## 🧪 Tests Post-Déploiement

### Checklist de Vérification

- [ ] **Frontend accessible** : https://votredomaine.tn
- [ ] **API accessible** : https://api.votredomaine.tn/api/docs
- [ ] **Login fonctionne** avec les identifiants démo
- [ ] **HTTPS actif** (cadenas vert dans le navigateur)
- [ ] **Certificat SSL valide** (vérifier l'expiration)
- [ ] **PM2 status OK** : `pm2 status`
- [ ] **Nginx status OK** : `sudo systemctl status nginx`
- [ ] **PostgreSQL status OK** : `sudo systemctl status postgresql`
- [ ] **Logs sans erreur** : `pm2 logs fleet-api`
- [ ] **Backup automatique configuré** : `sudo crontab -l`
- [ ] **Firewall actif** : `sudo ufw status`

### Tests Fonctionnels

1. **Test de login**

   ```bash
   curl -X POST https://api.votredomaine.tn/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@fleet.tn","password":"admin123"}'
   ```

2. **Test de récupération des véhicules** (avec le token obtenu)

   ```bash
   curl https://api.votredomaine.tn/api/v1/vehicles \
     -H "Authorization: Bearer VOTRE_TOKEN"
   ```

3. **Test du frontend**
   - Ouvrir https://votredomaine.tn
   - Se connecter avec admin@fleet.tn / admin123
   - Naviguer sur toutes les pages
   - Vérifier que les données s'affichent

---

## 🆘 Troubleshooting

### Problème : "502 Bad Gateway"

```bash
# Vérifier que l'API tourne
pm2 status
pm2 restart fleet-api

# Vérifier les logs
pm2 logs fleet-api
```

### Problème : "Connection refused" à PostgreSQL

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Vérifier les connexions
psql -U fleet_user -d fleet_management -h localhost
```

### Problème : SSL ne fonctionne pas

```bash
# Re-générer les certificats
sudo certbot --nginx -d votredomaine.tn -d www.votredomaine.tn --force-renewal

# Vérifier la configuration Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Problème : L'application ne démarre pas

```bash
# Vérifier les variables d'environnement
cat /var/www/fleet-api/.env

# Vérifier les logs
pm2 logs fleet-api --lines 200

# Vérifier les permissions
ls -la /var/www/fleet-api
```

---

## 📈 Optimisations de Performance

### 1. Activer la compression Nginx

```bash
sudo nano /etc/nginx/nginx.conf

# Ajouter dans la section http :
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;
```

### 2. Augmenter les limites PM2

```bash
pm2 start dist/main.js --name fleet-api --max-memory-restart 500M --instances 2
pm2 save
```

### 3. Configurer le cache PostgreSQL

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf

# Ajuster selon votre RAM (exemple pour 4GB RAM) :
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB

# Redémarrer
sudo systemctl restart postgresql
```

---

## 💰 Coûts Estimés

| Service         | Coût mensuel            |
| --------------- | ----------------------- |
| VPS Value (OVH) | ~8€                     |
| Domaine .tn     | ~2€ (24€/an)            |
| Certificat SSL  | Gratuit (Let's Encrypt) |
| **Total**       | **~10€/mois**           |

---

## 📚 Ressources Utiles

- [Documentation OVH VPS](https://docs.ovh.com/fr/vps/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation PM2](https://pm2.keymetrics.io/docs/)
- [Documentation Let's Encrypt](https://letsencrypt.org/docs/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)

---

## ✅ Checklist Finale

### Avant le déploiement

- [ ] VPS OVH commandé et reçu
- [ ] Domaine configuré (DNS pointés)
- [ ] Backend prêt avec .env configuré
- [ ] Frontend buildé avec la bonne API_URL

### Pendant le déploiement

- [ ] Serveur mis à jour
- [ ] Dépendances installées
- [ ] PostgreSQL configuré
- [ ] Backend déployé et PM2 configuré
- [ ] Frontend uploadé
- [ ] Nginx configuré
- [ ] SSL installé

### Après le déploiement

- [ ] Tests fonctionnels passés
- [ ] Backups automatiques configurés
- [ ] Monitoring en place
- [ ] Firewall activé
- [ ] Documentation à jour

---

**Félicitations ! 🎉 Votre application Fleet Management est maintenant en production sur OVH !**

**Support :** En cas de problème, consultez les logs ou contactez le support OVH.

**Temps estimé pour le déploiement complet : 2-3 heures**
