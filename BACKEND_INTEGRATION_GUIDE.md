# 🔌 Guide d'Intégration Backend - Fleet Management

## 📖 Introduction

Ce guide explique comment intégrer le backend avec le frontend de l'application Fleet Management.

---

## 📚 Documents de Référence

1. **README.md** - Documentation générale et liste des endpoints API
2. **API_DOCUMENTATION.md** - Documentation complète des APIs avec modèles de données et schémas de base de données
3. **BACKEND_EXAMPLES.md** - Exemples de code pour Node.js, Python (FastAPI) et PHP (Laravel)
4. **Ce document** - Guide d'intégration étape par étape

---

## 🎯 Étapes d'Intégration

### Étape 1: Configuration des Variables d'Environnement

#### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

#### Backend (.env)

Voir les exemples dans `API_DOCUMENTATION.md` section "Configuration"

### Étape 2: Modification du Service Layer (Frontend)

Le frontend utilise actuellement des données mockées. Pour connecter au backend :

**Fichier: `src/services/dataService.ts`**

```typescript
// Actuellement
export const vehicleService = {
  getAll: () => Promise.resolve(mockVehicles),
  // ...
};

// Changer en
export const vehicleService = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get("/vehicles", { params });
    return response.data.data;
  },
  // ...
};
```

### Étape 3: Configuration Axios (Frontend)

Le fichier `src/services/api.ts` contient déjà la configuration Axios avec :

- ✅ Intercepteurs pour le token JWT
- ✅ Gestion automatique du refresh token
- ✅ Redirection en cas d'authentification expirée
- ✅ Gestion des erreurs

**Aucune modification nécessaire**, il suffit de définir `VITE_API_URL` dans `.env.local`

### Étape 4: Implémenter les Endpoints Backend

Suivre les spécifications dans `API_DOCUMENTATION.md` et utiliser les exemples dans `BACKEND_EXAMPLES.md`

**Ordre de priorité recommandé:**

1. **Authentification** (`/auth/*`)

   - POST /auth/login
   - GET /auth/me
   - POST /auth/refresh
   - POST /auth/logout

2. **Véhicules** (`/vehicles/*`)

   - GET /vehicles (avec pagination, recherche, filtres)
   - POST /vehicles
   - GET /vehicles/:id
   - PUT /vehicles/:id
   - DELETE /vehicles/:id

3. **Chauffeurs** (`/drivers/*`)

   - Mêmes endpoints que véhicules

4. **Dashboard** (`/dashboard/*`)

   - GET /dashboard/stats

5. **Maintenance & Co**
   - GET /maintenance
   - GET /oil-changes
   - GET /technical-inspections
   - etc.

---

## 🔄 Migration des Données Mockées vers le Backend

### Option 1: Utiliser les Données de Démo

Les fichiers suivants contiennent les données de démo :

- `src/data/mockData.ts` - Toutes les données mockées

Vous pouvez exporter ces données et les utiliser pour seeder votre base de données.

**Script d'Export (Node.js):**

```javascript
// exportMockData.js
const mockData = require("./src/data/mockData.ts");
const fs = require("fs");

fs.writeFileSync(
  "seed-data.json",
  JSON.stringify(
    {
      vehicles: mockData.mockVehicles,
      drivers: mockData.mockDrivers,
      maintenance: mockData.mockMaintenances,
      oilChanges: mockData.mockOilChanges,
      technicalInspections: mockData.mockTechnicalInspections,
      insurances: mockData.mockInsurances,
      fuelConsumptions: mockData.mockFuelConsumption,
      tireChanges: mockData.mockTireChanges,
      washing: mockData.mockWashing,
    },
    null,
    2
  )
);

console.log("✅ Données exportées dans seed-data.json");
```

### Option 2: Créer un Seeder Backend

**Exemple avec Mongoose (Node.js):**

```javascript
// seeders/demoData.js
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

async function seedDatabase() {
  // Supprimer les données existantes
  await Vehicle.deleteMany({});
  await Driver.deleteMany({});

  // Insérer les données de démo
  const vehicles = [
    {
      plateNumber: "123 TUN 1234",
      brand: "Renault",
      model: "Kangoo",
      year: 2022,
      type: "van",
      status: "active",
      mileage: 45000,
      fuelType: "diesel",
      purchaseDate: new Date("2022-01-15"),
      purchasePrice: 45000,
    },
    // ...
  ];

  await Vehicle.insertMany(vehicles);
  console.log("✅ Véhicules insérés");
}

seedDatabase().then(() => process.exit(0));
```

---

## 🔐 Authentification

### Format du Token JWT

Le backend doit générer un JWT avec ce payload :

```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "admin | manager | driver",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Flow d'Authentification

```
1. Utilisateur entre email/password
2. Frontend envoie POST /auth/login
3. Backend vérifie et retourne token + refreshToken
4. Frontend stocke dans localStorage
5. Chaque requête inclut: Authorization: Bearer {token}
6. Si token expire, frontend rafraîchit automatiquement
```

### Compte de Démonstration

Créer un utilisateur admin par défaut :

```json
{
  "email": "admin@fleet.tn",
  "password": "admin123",
  "name": "Administrateur",
  "role": "admin"
}
```

---

## 📊 Statistiques Dynamiques

### Dashboard Stats

Le frontend s'attend à recevoir les statistiques du dashboard au format :

```json
{
  "success": true,
  "data": {
    "vehicles": {
      "total": 25,
      "active": 20,
      "inMaintenance": 3,
      "outOfService": 2
    },
    "drivers": {
      "total": 30,
      "available": 22,
      "onTrip": 6,
      "onLeave": 2
    },
    "maintenance": {
      "scheduled": 8,
      "inProgress": 2,
      "completedThisMonth": 15,
      "totalCostThisMonth": 8500.0
    },
    "fuel": {
      "totalCostThisMonth": 12500.0,
      "averageConsumption": 8.5,
      "averageCostPerLiter": 2.1
    },
    "alerts": {
      "total": 12,
      "high": 4,
      "medium": 5,
      "low": 3
    },
    "insurance": {
      "totalActive": 22,
      "expiringThisMonth": 3,
      "totalCostThisMonth": 2400.0
    }
  }
}
```

**Implémentation Backend:**

```javascript
// Exemple avec Node.js
router.get("/dashboard/stats", authenticate, async (req, res) => {
  const [
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    outOfServiceVehicles,
    totalDrivers,
    // ... autres requêtes
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: "active" }),
    Vehicle.countDocuments({ status: "maintenance" }),
    Vehicle.countDocuments({ status: "out_of_service" }),
    Driver.countDocuments(),
    // ...
  ]);

  res.json({
    success: true,
    data: {
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
        inMaintenance: maintenanceVehicles,
        outOfService: outOfServiceVehicles,
      },
      // ... reste des stats
    },
  });
});
```

---

## 🔔 Système d'Alertes

### Génération Automatique

Le backend doit générer des alertes automatiquement via un CRON job quotidien :

**Règles d'Alertes:**

1. **Visite Technique:**

   - 7 jours avant expiration → Priorité moyenne
   - 3 jours avant expiration → Priorité haute

2. **Vidange:**

   - 7 jours avant date prévue → Priorité moyenne
   - 3 jours avant date prévue → Priorité haute

3. **Assurance:**

   - 30 jours avant expiration → Priorité moyenne
   - 7 jours avant expiration → Priorité haute
   - 3 jours avant expiration → Priorité haute

4. **Permis de Conduire:**
   - 30 jours avant expiration → Priorité moyenne
   - 7 jours avant expiration → Priorité haute

**Voir `BACKEND_EXAMPLES.md` pour l'implémentation du CRON job**

---

## 📤 Upload de Fichiers

### Endpoint: POST /vehicles/:id/files

**Frontend envoie:**

```javascript
const formData = new FormData();
formData.append("file", file);

await api.post(`/vehicles/${vehicleId}/files`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

**Backend doit:**

1. Valider le fichier (taille, type)
2. Sauvegarder sur disque ou cloud (S3, etc.)
3. Créer un enregistrement dans `file_attachments`
4. Retourner l'URL du fichier

**Exemple avec Express + Multer:**

```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/vehicles/:id/files",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;

    const fileAttachment = await FileAttachment.create({
      vehicleId: req.params.id,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      fileUrl: `/uploads/${file.filename}`,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: fileAttachment,
    });
  }
);
```

---

## 🔍 Recherche et Filtres

Le frontend envoie les paramètres de recherche et filtrage en query params :

```
GET /vehicles?search=123&status=active&type=van&page=1&limit=10
```

**Backend doit:**

1. Construire la requête SQL/NoSQL dynamiquement
2. Appliquer les filtres
3. Paginer les résultats
4. Retourner avec le format de pagination attendu

**Exemple:**

```javascript
const { page = 1, limit = 10, search, status, type } = req.query;

const query = {};
if (search) {
  query.$or = [
    { plateNumber: { $regex: search, $options: "i" } },
    { brand: { $regex: search, $options: "i" } },
    { model: { $regex: search, $options: "i" } },
  ];
}
if (status) query.status = status;
if (type) query.type = type;

const vehicles = await Vehicle.find(query)
  .skip((page - 1) * limit)
  .limit(parseInt(limit));

const total = await Vehicle.countDocuments(query);

res.json({
  success: true,
  data: vehicles,
  pagination: {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / limit),
  },
});
```

---

## 🧪 Tests

### Tests Recommandés

1. **Tests Unitaires** - Fonctions de calcul, helpers
2. **Tests d'Intégration** - Endpoints API
3. **Tests E2E** - Flow complet utilisateur

**Exemple avec Jest:**

```javascript
// tests/auth.test.js
describe("POST /auth/login", () => {
  it("should return token on valid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@fleet.tn",
      password: "admin123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it("should return 401 on invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@fleet.tn",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
```

---

## 📦 Déploiement

### Backend

**Options recommandées:**

1. **Heroku** - Simple, idéal pour démarrer
2. **DigitalOcean App Platform** - Flexible
3. **AWS Elastic Beanstalk** - Scalable
4. **Google Cloud Run** - Serverless
5. **VPS (OVH, etc.)** - Contrôle total

**Checklist de Déploiement:**

- [ ] Variables d'environnement configurées
- [ ] Base de données hébergée (MongoDB Atlas, PostgreSQL sur RDS, etc.)
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Backup de la base de données automatisé
- [ ] Monitoring activé (Sentry, LogRocket, etc.)

### Frontend

**Options recommandées:**

1. **Vercel** - Optimal pour React + Vite
2. **Netlify** - Alternative excellente
3. **AWS S3 + CloudFront** - Scalable
4. **GitHub Pages** - Gratuit pour projets publics

**Configuration:**

```bash
# Build
npm run build

# Le dossier dist/ contient les fichiers statiques à déployer
```

---

## 🔧 Debugging

### Erreurs Communes

#### 1. CORS Error

**Problème:** Requêtes bloquées par le navigateur

**Solution:** Configurer CORS sur le backend

```javascript
// Express
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fleet.votredomaine.tn"],
    credentials: true,
  })
);
```

#### 2. Token Expired

**Problème:** Token JWT expiré

**Solution:** Le frontend rafraîchit automatiquement le token via l'intercepteur Axios

#### 3. 404 Not Found

**Problème:** Endpoint non trouvé

**Solution:** Vérifier que l'URL de base dans `.env.local` est correcte

#### 4. Validation Error

**Problème:** Données invalides envoyées au backend

**Solution:** Vérifier les schémas de validation côté backend et frontend

---

## 📞 Support

Pour toute question ou problème d'intégration :

1. Consulter `API_DOCUMENTATION.md` pour les spécifications détaillées
2. Consulter `BACKEND_EXAMPLES.md` pour des exemples de code
3. Vérifier les logs du backend et du frontend
4. Utiliser les outils de développement du navigateur (Network tab)

---

## ✅ Checklist d'Intégration Complète

### Frontend

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Services API mis à jour pour utiliser les vrais endpoints
- [ ] Tests des flux d'authentification
- [ ] Tests des CRUD (Create, Read, Update, Delete)
- [ ] Tests de recherche et filtres
- [ ] Tests d'upload de fichiers
- [ ] Tests responsive

### Backend

- [ ] Base de données créée et configurée
- [ ] Modèles/Schémas implémentés
- [ ] Endpoints d'authentification implémentés
- [ ] Endpoints CRUD pour toutes les entités
- [ ] Middleware d'authentification et autorisation
- [ ] Validation des données entrantes
- [ ] Gestion des erreurs standardisée
- [ ] CRON job pour génération des alertes
- [ ] Upload de fichiers implémenté
- [ ] Statistiques dashboard calculées dynamiquement
- [ ] Tests unitaires et d'intégration
- [ ] Documentation Postman/Swagger (optionnel)
- [ ] Seeder pour données de démo
- [ ] Logs configurés
- [ ] Rate limiting activé
- [ ] Backup configuré

### Déploiement

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] HTTPS activé sur les deux
- [ ] DNS configuré
- [ ] Monitoring activé
- [ ] Alertes en cas d'erreur configurées
- [ ] Backup automatisé de la base de données

---

## 🎉 Après l'Intégration

Une fois l'intégration terminée :

1. Tester tous les flux utilisateur
2. Vérifier les performances (temps de chargement)
3. Optimiser les requêtes si nécessaire
4. Ajouter du caching (Redis) si besoin
5. Documenter les changements
6. Former les utilisateurs

---

**Document créé pour Fleet Management App**
**Version 1.0 - Octobre 2025**

**Bonne intégration ! 🚀**
