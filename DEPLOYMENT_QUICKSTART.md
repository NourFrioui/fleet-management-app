# ⚡ Déploiement Rapide - Fleet Management

## 📋 Guide Rapide en 3 Étapes

### 🎯 Objectif

Déployer votre application complète (Frontend + Backend) sur OVH en moins de 30 minutes.

---

## 🚀 Méthode 1 : Script Simple (Recommandé pour débuter)

### Prérequis

- ✅ VPS OVH configuré (voir [DEPLOYMENT_OVH.md](DEPLOYMENT_OVH.md))
- ✅ Accès SSH configuré
- ✅ Node.js installé localement

### Étape 1 : Configuration du Script

Éditer `deploy.sh` et modifier ces lignes :

```bash
VPS_HOST="51.91.123.45"                        # ← Votre IP VPS
VPS_USER="ubuntu"                               # ← OK si vous utilisez Ubuntu
VPS_FRONTEND_PATH="/var/www/fleet-frontend"     # ← OK par défaut
API_URL="https://api.votredomaine.tn/api/v1"   # ← Votre domaine
```

### Étape 2 : Tester la Connexion SSH

```bash
# Tester la connexion
./deploy.sh
# Choisir l'option 3 (Tester la connexion SSH)
```

Si ça ne fonctionne pas, configurer l'accès SSH :

```bash
# Copier votre clé SSH sur le serveur
ssh-copy-id ubuntu@51.91.123.45

# Tester
ssh ubuntu@51.91.123.45 "echo OK"
```

### Étape 3 : Déployer !

```bash
# Lancer le script
./deploy.sh

# Choisir l'option 1 (Déployer le Frontend)
```

✅ **C'est tout !** Votre application est déployée sur `https://votredomaine.tn`

---

## 🤖 Méthode 2 : GitHub Actions (Automatique)

### Avantages

- ✅ Déploiement automatique à chaque push
- ✅ Tests automatiques
- ✅ Rollback facile
- ✅ Historique des déploiements

### Étape 1 : Configurer les Secrets GitHub

Aller sur GitHub → Settings → Secrets and variables → Actions

Créer ces secrets :

| Nom                 | Valeur                | Exemple                              |
| ------------------- | --------------------- | ------------------------------------ |
| `VPS_HOST`          | IP de votre VPS       | `51.91.123.45`                       |
| `VPS_USER`          | Utilisateur SSH       | `ubuntu`                             |
| `VPS_SSH_KEY`       | Votre clé SSH privée  | (tout le contenu de `~/.ssh/id_rsa`) |
| `VPS_FRONTEND_PATH` | Chemin sur le serveur | `/var/www/fleet-frontend`            |

**Comment obtenir votre clé SSH privée :**

```bash
# Sur votre machine locale
cat ~/.ssh/id_rsa

# Copier TOUT le contenu (y compris BEGIN et END)
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... (tout le contenu)
# -----END OPENSSH PRIVATE KEY-----
```

### Étape 2 : Activer le Workflow

```bash
# Renommer le fichier exemple
mv .github/workflows/deploy-frontend.example.yml .github/workflows/deploy-frontend.yml

# Éditer et remplacer "votredomaine.tn" par votre vrai domaine
nano .github/workflows/deploy-frontend.yml

# Commit et push
git add .github/workflows/deploy-frontend.yml
git commit -m "Add deployment workflow"
git push
```

### Étape 3 : Déployer

**Déploiement automatique :**

```bash
# Chaque push sur main déploie automatiquement
git push origin main
```

**Déploiement manuel :**

1. Aller sur GitHub → Actions
2. Cliquer sur "Deploy Frontend to OVH"
3. Cliquer sur "Run workflow"

✅ **Le déploiement se fait automatiquement !**

---

## 📊 Comparaison Rapide

| Critère         | Script Simple         | GitHub Actions       |
| --------------- | --------------------- | -------------------- |
| **Setup**       | 5 min                 | 15 min               |
| **Utilisation** | Lancer `./deploy.sh`  | Automatique sur push |
| **Tests**       | Manuel                | Automatique          |
| **Rollback**    | Facile (option menu)  | Via GitHub           |
| **Idéal pour**  | Début, petits projets | Production, équipes  |

---

## 🆘 Problèmes Courants

### ❌ "Permission denied (publickey)"

**Cause :** SSH non configuré

**Solution :**

```bash
# Copier votre clé SSH sur le serveur
ssh-copy-id ubuntu@51.91.123.45

# Ou créer une nouvelle paire de clés
ssh-keygen -t rsa -b 4096
ssh-copy-id ubuntu@51.91.123.45
```

### ❌ "Cannot connect to server"

**Cause :** Serveur non accessible

**Solution :**

```bash
# Vérifier que le serveur est accessible
ping 51.91.123.45

# Vérifier le port SSH (22 par défaut)
nc -zv 51.91.123.45 22

# Vérifier le firewall OVH (dans l'interface OVH)
```

### ❌ "sudo: no tty present"

**Cause :** L'utilisateur n'a pas les droits sudo sans mot de passe

**Solution :**

```bash
# Sur le serveur, éditer sudoers
sudo visudo

# Ajouter cette ligne (remplacer ubuntu par votre user)
ubuntu ALL=(ALL) NOPASSWD: ALL
```

### ❌ Build échoue

**Cause :** Dépendances manquantes ou erreurs de code

**Solution :**

```bash
# Tester le build localement
npm install
npm run build

# Vérifier les erreurs
npm run lint
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **[DEPLOYMENT_OVH.md](DEPLOYMENT_OVH.md)** - Guide complet de configuration du serveur OVH
- **[CICD_PIPELINE.md](CICD_PIPELINE.md)** - Guide complet CI/CD avec GitHub Actions et GitLab CI
- **[BACKEND_NESTJS_GUIDE.md](BACKEND_NESTJS_GUIDE.md)** - Guide backend NestJS + PostgreSQL

---

## ✅ Checklist de Déploiement

### Avant le Premier Déploiement

- [ ] VPS OVH commandé et configuré
- [ ] SSH fonctionnel (test avec `ssh ubuntu@IP`)
- [ ] Domaine configuré (DNS pointés vers le VPS)
- [ ] Nginx installé et configuré sur le serveur
- [ ] SSL (Let's Encrypt) installé
- [ ] Dossiers créés : `/var/www/fleet-frontend`

### Déploiement Frontend

- [ ] Script `deploy.sh` configuré OU secrets GitHub configurés
- [ ] URL API correcte dans la config
- [ ] Build local réussi (`npm run build`)
- [ ] Connexion SSH testée
- [ ] Premier déploiement effectué
- [ ] Site accessible via HTTPS

### Backend (Si applicable)

- [ ] PostgreSQL installé et configuré
- [ ] `.env` configuré sur le serveur
- [ ] PM2 installé
- [ ] Backend déployé et démarré
- [ ] API accessible via HTTPS
- [ ] Swagger accessible

---

## 🎯 Commandes Utiles

### Vérifier le Déploiement

```bash
# Tester le frontend
curl -I https://votredomaine.tn

# Tester l'API
curl https://api.votredomaine.tn/api/docs

# Voir les logs Nginx
ssh ubuntu@IP "sudo tail -f /var/log/nginx/access.log"
```

### Gestion des Backups

```bash
# Voir les backups disponibles
./deploy.sh
# Choisir option 4

# Restaurer un backup
./deploy.sh
# Choisir option 2
```

### Monitoring

```bash
# Se connecter au serveur
ssh ubuntu@IP

# Voir l'utilisation disque
df -h

# Voir l'utilisation RAM
free -h

# Voir les process
htop
```

---

## 🚀 Prochaines Étapes

Après votre premier déploiement réussi :

1. **Configurer le Backend** - Suivre [BACKEND_NESTJS_GUIDE.md](BACKEND_NESTJS_GUIDE.md)
2. **Automatiser avec CI/CD** - Suivre [CICD_PIPELINE.md](CICD_PIPELINE.md)
3. **Configurer les Backups** - Voir section Backups dans [DEPLOYMENT_OVH.md](DEPLOYMENT_OVH.md)
4. **Monitoring** - Mettre en place PM2 Monitoring ou Uptime Robot
5. **Optimisation** - Activer la compression, le cache, etc.

---

## 💡 Conseils Pro

1. **Toujours tester localement** avant de déployer
2. **Faire des backups** avant chaque déploiement (le script le fait automatiquement)
3. **Utiliser des branches** : `develop` pour les tests, `main` pour la production
4. **Monitorer** : Vérifier les logs après chaque déploiement
5. **Documenter** : Noter les changements et les configurations

---

**🎉 Félicitations ! Vous êtes prêt à déployer votre application !**

**Questions ? Consultez [CICD_PIPELINE.md](CICD_PIPELINE.md) pour plus de détails.**
