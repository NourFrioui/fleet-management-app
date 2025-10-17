# ⚡ Backend Quick Start - Fleet Management

## 🎯 Démarrage Rapide en 5 Minutes

### 1️⃣ Lire les Documents (dans l'ordre)

1. **README.md** → Vue d'ensemble + Liste des endpoints
2. **API_DOCUMENTATION.md** → Spécifications complètes des APIs
3. **BACKEND_EXAMPLES.md** → Exemples de code (Node.js, Python, PHP)
4. **BACKEND_INTEGRATION_GUIDE.md** → Guide pas à pas

---

## 📋 Checklist Rapide

### Phase 1: Setup Initial (1-2h)

```bash
# 1. Créer le projet backend
mkdir fleet-management-api
cd fleet-management-api

# 2. Choisir votre stack (exemple avec Node.js + Express)
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv

# 3. Créer la structure de base
mkdir -p src/{models,routes,middleware,config}

# 4. Configurer .env
cp .env.example .env
# Remplir les variables (DB, JWT_SECRET, etc.)
```

### Phase 2: Authentification (2-3h)

```bash
# 1. Créer le modèle User
# → Voir BACKEND_EXAMPLES.md ligne 150

# 2. Créer routes /auth/login, /auth/me, /auth/refresh
# → Voir BACKEND_EXAMPLES.md ligne 200

# 3. Créer middleware authenticate
# → Voir BACKEND_EXAMPLES.md ligne 120

# 4. Tester avec Postman
POST http://localhost:8000/api/v1/auth/login
{
  "email": "admin@fleet.tn",
  "password": "admin123"
}
```

### Phase 3: Endpoints Principaux (4-6h)

**Ordre de priorité:**

1. **Véhicules** - CRUD complet avec pagination/recherche/filtres
2. **Chauffeurs** - CRUD complet
3. **Dashboard Stats** - Calcul dynamique des statistiques
4. **Maintenance** - CRUD pour maintenance, vidanges, visites techniques

### Phase 4: Fonctionnalités Avancées (4-6h)

1. **Alertes** - CRON job pour génération automatique
2. **Carburant** - CRUD + statistiques
3. **Assurances** - CRUD avec calculs de taxes
4. **Upload Fichiers** - Multer/S3
5. **Calendrier** - Génération des événements

### Phase 5: Finitions (2-3h)

1. **Tests** - Unitaires et d'intégration
2. **Seeder** - Données de démo
3. **Documentation** - Postman/Swagger
4. **Déploiement** - Heroku/DigitalOcean/AWS

---

## 🚀 Endpoints Prioritaires (MVP)

### Must Have (Phase 1-2 semaines)

```
✅ POST   /auth/login
✅ GET    /auth/me
✅ POST   /auth/refresh

✅ GET    /vehicles (avec pagination, search, filtres)
✅ POST   /vehicles
✅ GET    /vehicles/:id
✅ PUT    /vehicles/:id
✅ DELETE /vehicles/:id

✅ GET    /drivers (idem véhicules)
✅ POST   /drivers
✅ GET    /drivers/:id
✅ PUT    /drivers/:id
✅ DELETE /drivers/:id

✅ GET    /dashboard/stats
```

### Nice to Have (Phase 2-3 semaines)

```
⭐ GET    /maintenance
⭐ POST   /maintenance
⭐ GET    /oil-changes
⭐ POST   /oil-changes
⭐ GET    /technical-inspections
⭐ POST   /technical-inspections

⭐ GET    /fuel-consumptions
⭐ GET    /fuel-consumptions/statistics
⭐ POST   /fuel-consumptions

⭐ GET    /insurances
⭐ POST   /insurances

⭐ GET    /calendar/events
```

### Can Wait (Phase 3-4 semaines)

```
💡 GET    /tire-changes
💡 GET    /washing
💡 GET    /alerts
💡 POST   /vehicles/:id/files
💡 GET    /vehicles/:id/files
```

---

## 🗄️ Schéma de Base de Données Minimal

### PostgreSQL / MySQL

```sql
-- Essentiel pour MVP
CREATE TABLE users (id, name, email, password, role);
CREATE TABLE vehicles (id, plate_number, brand, model, year, type, status, mileage);
CREATE TABLE drivers (id, name, email, phone, license_number, license_expiry, status);
CREATE TABLE maintenance (id, vehicle_id, type, scheduled_date, status, cost);
CREATE TABLE fuel_consumptions (id, vehicle_id, date, quantity, cost, mileage);

-- Nice to have
CREATE TABLE oil_changes (id, vehicle_id, scheduled_date, status, oil_type);
CREATE TABLE technical_inspections (id, vehicle_id, inspection_date, expiry_date, result);
CREATE TABLE insurances (id, vehicle_id, company, policy_number, start_date, end_date);
CREATE TABLE alerts (id, type, title, message, priority, status, due_date);

-- Can wait
CREATE TABLE tire_changes (id, vehicle_id, date, position, cost);
CREATE TABLE washing (id, vehicle_id, date, type, cost);
CREATE TABLE file_attachments (id, vehicle_id, file_name, file_url);
```

**Voir `API_DOCUMENTATION.md` pour le schéma SQL complet avec tous les champs**

---

## 🧪 Tester l'API Rapidement

### Avec cURL

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fleet.tn","password":"admin123"}'

# Copier le token retourné

# 2. Récupérer les véhicules
curl http://localhost:8000/api/v1/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Créer un véhicule
curl -X POST http://localhost:8000/api/v1/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plateNumber":"123 TUN 1234",
    "brand":"Renault",
    "model":"Kangoo",
    "year":2022,
    "type":"van",
    "fuelType":"diesel",
    "purchaseDate":"2022-01-15",
    "purchasePrice":45000
  }'
```

### Avec Postman

1. Importer la collection (créer à partir de la doc)
2. Configurer l'environnement (base URL, token)
3. Tester les endpoints un par un

---

## 🔑 Points Clés à Retenir

### Format de Réponse Standard

**Succès:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible"
  }
}
```

### Authentification

- JWT avec expiration 1h
- Refresh token avec expiration 7 jours
- Header: `Authorization: Bearer {token}`

### Pagination

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Dates

- Format: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- Toujours en UTC

### Montants

- Toujours en TND (Tunisian Dinar)
- Format: décimal avec 2 décimales (ex: 45000.00)

---

## 📚 Ressources Utiles

### Documentation Complète

- **API_DOCUMENTATION.md** → Tous les endpoints, modèles, schémas SQL
- **BACKEND_EXAMPLES.md** → Code complet pour Node.js, Python, PHP
- **BACKEND_INTEGRATION_GUIDE.md** → Guide étape par étape

### Exemples de Code

**Modèles:** BACKEND_EXAMPLES.md ligne 50-150
**Routes:** BACKEND_EXAMPLES.md ligne 200-400
**Auth Middleware:** BACKEND_EXAMPLES.md ligne 120-180
**CRON Jobs:** BACKEND_EXAMPLES.md ligne 500-600

### Outils Recommandés

- **Postman** - Tester les APIs
- **MongoDB Compass** / **pgAdmin** - Explorer la DB
- **VS Code** + extensions (ESLint, Prettier)
- **Nodemon** - Auto-reload en dev
- **PM2** - Process manager en production

---

## ⚠️ Pièges à Éviter

### ❌ Ne PAS faire:

1. **Oublier de hasher les mots de passe** → Utiliser bcrypt
2. **Ne pas valider les données** → Utiliser Joi, Yup, class-validator
3. **Exposer les erreurs détaillées en prod** → Masquer les stack traces
4. **Ne pas paginer les listes** → Toujours paginer
5. **Stocker les tokens en clair** → Utiliser httpOnly cookies ou localStorage (frontend)
6. **Ne pas gérer les erreurs** → Try/catch partout
7. **Oublier les index DB** → Indexer les champs de recherche/filtrage

### ✅ À FAIRE absolument:

1. **Valider toutes les entrées** utilisateur
2. **Hasher les mots de passe** avec bcrypt (min 10 rounds)
3. **Utiliser HTTPS** en production
4. **Implémenter rate limiting** pour éviter les abus
5. **Logger les actions importantes** (connexion, création, modification, suppression)
6. **Gérer les erreurs** de façon standardisée
7. **Tester les endpoints** avant de déployer

---

## 🎯 Objectif Final

Une API REST complète avec :

- ✅ Authentification JWT sécurisée
- ✅ CRUD complet pour toutes les entités
- ✅ Pagination, recherche, filtres sur toutes les listes
- ✅ Statistiques calculées dynamiquement
- ✅ Génération automatique des alertes
- ✅ Upload de fichiers
- ✅ Format de réponse standardisé
- ✅ Gestion d'erreurs robuste
- ✅ Tests unitaires et d'intégration
- ✅ Documentation complète (Postman/Swagger)
- ✅ Déployé et accessible en HTTPS

---

## 📞 Questions Fréquentes

### Q: Quelle stack choisir ?

**R:** Utilisez ce que vous connaissez le mieux :

- **NestJS + PostgreSQL** → **Recommandé !** Architecture professionnelle + TypeScript natif (voir **BACKEND_NESTJS_GUIDE.md**)
- Node.js + Express → Rapide à développer
- Python + FastAPI → Performance + typage
- PHP + Laravel → Batteries included

### Q: MongoDB ou PostgreSQL ?

**R:** Les deux fonctionnent bien :

- MongoDB → Plus flexible, bon pour prototyper
- PostgreSQL → Plus structuré, meilleur pour les relations

### Q: Dois-je implémenter tous les endpoints ?

**R:** Commencez par le MVP (Authentification + Véhicules + Chauffeurs + Dashboard), puis ajoutez le reste progressivement.

### Q: Comment gérer les fichiers uploadés ?

**R:** Solutions :

1. **Stockage local** → Simple mais ne scale pas
2. **S3/Cloudinary** → Recommandé pour la production
3. **Google Cloud Storage** → Alternative à S3

### Q: Dois-je créer une documentation Swagger ?

**R:** Recommandé mais pas obligatoire. La documentation Markdown fournie est déjà très complète.

---

## 🚀 Let's Go!

1. ✅ Lire API_DOCUMENTATION.md
2. ✅ Choisir votre stack
3. ✅ Setup le projet
4. ✅ Implémenter l'authentification
5. ✅ Implémenter les endpoints prioritaires
6. ✅ Tester avec Postman
7. ✅ Connecter avec le frontend
8. ✅ Déployer

**Temps estimé pour un MVP fonctionnel: 2-3 semaines** (selon votre expérience)

---

**Bon développement ! 💪**

Si vous avez des questions, référez-vous aux documents de documentation ou créez une issue sur GitHub.
