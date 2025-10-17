# 🚛 Fleet Management App

Une application web complète de gestion de flotte de véhicules développée avec React, TypeScript et TailwindCSS.

## 🎯 Fonctionnalités

### ✅ Implémentées

- **Système d'authentification complet** avec gestion de session
- **Dashboard interactif** avec statistiques en temps réel
- **Gestion des véhicules** (liste, filtres, recherche)
- **Gestion des chauffeurs** (liste, statuts, permis)
- **Calendrier de maintenance** intégré avec react-big-calendar
- **Suivi des maintenances** (planification, statuts, coûts)
- **Gestion du carburant** (enregistrements, consommation, coûts)
- **Interface responsive** avec TailwindCSS
- **Architecture modulaire** prête pour l'intégration backend

### 🚧 À implémenter

- Formulaires d'ajout/modification des entités
- Pages de détails complètes
- Gestion des permissions par rôle
- Export de données
- Notifications en temps réel
- Graphiques avancés

## 🛠️ Stack Technique

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **État**: Context API
- **HTTP Client**: Axios
- **Calendrier**: react-big-calendar + moment
- **Icônes**: Lucide React

## 🚀 Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd fleet-management-app
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer l'environnement**

```bash
cp .env.example .env.local
# Modifier les variables selon votre configuration
```

4. **Démarrer l'application**

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🔐 Compte de démonstration

Pour tester l'application, utilisez ces identifiants :

- **Email**: `admin@fleet.com`
- **Mot de passe**: `admin123`

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout.tsx      # Layout principal avec navigation
│   ├── Login.tsx       # Page de connexion
│   └── ProtectedRoute.tsx # Protection des routes
├── contexts/           # Contextes React
│   └── AuthContext.tsx # Gestion de l'authentification
├── pages/              # Pages de l'application
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── Vehicles.tsx    # Gestion des véhicules
│   ├── Drivers.tsx     # Gestion des chauffeurs
│   ├── Calendar.tsx    # Calendrier de maintenance
│   ├── Maintenance.tsx # Gestion des maintenances
│   └── Fuel.tsx        # Gestion du carburant
├── services/           # Services API
│   └── api.ts          # Configuration Axios et services
├── types/              # Types TypeScript
│   └── index.ts        # Définitions des types
└── App.tsx             # Composant racine avec routage
```

## 🔌 Intégration Backend

L'application est prête pour l'intégration avec un backend REST. Les services API sont configurés dans `src/services/dataService.ts` avec :

- Configuration Axios avec intercepteurs
- Gestion automatique des tokens d'authentification
- Services pour toutes les entités (véhicules, chauffeurs, maintenance, carburant, assurances, etc.)
- Gestion des erreurs et redirection automatique

### 📋 Documentation complète des APIs Backend Nécessaires

#### Base URL

```
Production: https://api.votredomaine.tn/api/v1
Development: http://localhost:8000/api/v1
```

---

### 🔐 Authentification

#### **POST** `/auth/login`

Connexion utilisateur

**Request Body:**

```json
{
  "email": "admin@fleet.tn",
  "password": "string"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "admin | manager | driver",
      "createdAt": "ISO 8601 date"
    },
    "token": "JWT token",
    "refreshToken": "string",
    "expiresIn": 3600
  }
}
```

#### **POST** `/auth/logout`

Déconnexion utilisateur

**Headers:** `Authorization: Bearer {token}`

**Response 200:**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

#### **GET** `/auth/me`

Récupérer les informations de l'utilisateur connecté

**Headers:** `Authorization: Bearer {token}`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "ISO 8601 date"
  }
}
```

#### **POST** `/auth/refresh`

Renouveler le token d'authentification

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "new JWT token",
    "expiresIn": 3600
  }
}
```

---

### 🚗 Véhicules

#### **GET** `/vehicles`

Liste tous les véhicules

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string): Recherche par matricule, marque, modèle
- `status` (string): active | maintenance | out_of_service
- `type` (string): car | truck | van | motorcycle | bus | trailer

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "plateNumber": "123 TUN 1234",
      "brand": "string",
      "model": "string",
      "year": 2024,
      "type": "car | truck | van | motorcycle | bus | trailer",
      "status": "active | maintenance | out_of_service",
      "mileage": 50000,
      "fuelType": "gasoline | diesel | electric | hybrid",
      "purchaseDate": "ISO 8601 date",
      "purchasePrice": 45000.0,
      "currentValue": 35000.0,
      "insuranceExpiry": "ISO 8601 date",
      "technicalInspectionExpiry": "ISO 8601 date",
      "assignedDriverId": "string | null",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### **POST** `/vehicles`

Créer un nouveau véhicule

**Request Body:**

```json
{
  "plateNumber": "123 TUN 1234",
  "brand": "string",
  "model": "string",
  "year": 2024,
  "type": "car | truck | van | motorcycle | bus | trailer",
  "fuelType": "gasoline | diesel | electric | hybrid",
  "purchaseDate": "ISO 8601 date",
  "purchasePrice": 45000.0,
  "mileage": 50000,
  "status": "active"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    /* Vehicle object */
  }
}
```

#### **GET** `/vehicles/:id`

Détails d'un véhicule

**Response 200:**

```json
{
  "success": true,
  "data": {
    /* Vehicle object */
  }
}
```

#### **PUT** `/vehicles/:id`

Mettre à jour un véhicule

**Request Body:** (tous les champs sont optionnels)

```json
{
  "plateNumber": "string",
  "status": "string",
  "mileage": 55000
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    /* Updated vehicle object */
  }
}
```

#### **DELETE** `/vehicles/:id`

Supprimer un véhicule

**Response 200:**

```json
{
  "success": true,
  "message": "Véhicule supprimé avec succès"
}
```

#### **GET** `/vehicles/:id/files`

Liste des fichiers attachés à un véhicule

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "fileName": "string",
      "fileType": "string",
      "fileSize": 1024000,
      "fileUrl": "string",
      "uploadedAt": "ISO 8601 date"
    }
  ]
}
```

#### **POST** `/vehicles/:id/files`

Ajouter un fichier à un véhicule

**Request:** `multipart/form-data`

- `file`: File

**Response 201:**

```json
{
  "success": true,
  "data": {
    /* File attachment object */
  }
}
```

---

### 👥 Chauffeurs

#### **GET** `/drivers`

Liste tous les chauffeurs

**Query Parameters:**

- `page`, `limit`, `search`
- `status`: available | on_trip | on_leave | inactive

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "licenseNumber": "string",
      "licenseExpiry": "ISO 8601 date",
      "status": "available | on_trip | on_leave | inactive",
      "hireDate": "ISO 8601 date",
      "assignedVehicleId": "string | null",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/drivers`

Créer un nouveau chauffeur

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "licenseNumber": "string",
  "licenseExpiry": "ISO 8601 date",
  "hireDate": "ISO 8601 date"
}
```

#### **GET** `/drivers/:id`

Détails d'un chauffeur

#### **PUT** `/drivers/:id`

Mettre à jour un chauffeur

#### **DELETE** `/drivers/:id`

Supprimer un chauffeur

---

### 🔧 Maintenance Générale

#### **GET** `/maintenance`

Liste toutes les maintenances

**Query Parameters:**

- `page`, `limit`, `search`
- `vehicleId`: Filter by vehicle
- `status`: scheduled | in_progress | completed | cancelled

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "type": "preventive | corrective | inspection",
      "scheduledDate": "ISO 8601 date",
      "completedDate": "ISO 8601 date | null",
      "status": "scheduled | in_progress | completed | cancelled",
      "description": "string",
      "cost": 250.0,
      "mileage": 50000,
      "serviceProvider": "string",
      "partsReplaced": ["string"],
      "laborHours": 3.5,
      "priority": "low | medium | high | urgent",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/maintenance`

Créer une nouvelle maintenance

#### **GET** `/maintenance/:id`

Détails d'une maintenance

#### **PUT** `/maintenance/:id`

Mettre à jour une maintenance

#### **DELETE** `/maintenance/:id`

Supprimer une maintenance

---

### 🛢️ Vidanges (Oil Changes)

#### **GET** `/oil-changes`

Liste toutes les vidanges

**Query Parameters:** (similaires à maintenance)

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "scheduledDate": "ISO 8601 date",
      "completedDate": "ISO 8601 date | null",
      "status": "scheduled | in_progress | completed | cancelled",
      "cost": 120.0,
      "mileage": 45000,
      "oilType": "synthetic | semi_synthetic | mineral | diesel",
      "oilQuantity": 5.5,
      "oilBrand": "string",
      "filterChanged": true,
      "filterBrand": "string",
      "nextOilChangeMileage": 60000,
      "nextOilChangeDate": "ISO 8601 date",
      "technician": "string",
      "serviceCenter": "string",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/oil-changes`

Créer une nouvelle vidange

#### **GET** `/oil-changes/:id`

Détails d'une vidange

#### **PUT** `/oil-changes/:id`

Mettre à jour une vidange

#### **DELETE** `/oil-changes/:id`

Supprimer une vidange

---

### 🔍 Visites Techniques

#### **GET** `/technical-inspections`

Liste toutes les visites techniques

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "inspectionType": "periodic | pre_purchase | post_repair",
      "inspectionDate": "ISO 8601 date",
      "expiryDate": "ISO 8601 date",
      "result": "favorable | favorable_with_restrictions | unfavorable | pending",
      "mileage": 45000,
      "cost": 85.0,
      "inspectorName": "string",
      "inspectionCenter": "string",
      "centerAddress": "string",
      "centerPhone": "string",
      "responsible": "string",
      "nextInspectionDate": "ISO 8601 date",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/technical-inspections`

Créer une nouvelle visite technique

#### **GET** `/technical-inspections/:id`

Détails d'une visite technique

#### **PUT** `/technical-inspections/:id`

Mettre à jour une visite technique

#### **DELETE** `/technical-inspections/:id`

Supprimer une visite technique

---

### 🛞 Changement de Pneus

#### **GET** `/tire-changes`

Liste tous les changements de pneus

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "date": "ISO 8601 date",
      "position": "AVD | AVG | ARD | ARG | ALL",
      "tireBrand": "string",
      "tireModel": "string",
      "tireSize": "string",
      "cost": 450.0,
      "mileage": 50000,
      "serviceProvider": "string",
      "warranty": "12 mois",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/tire-changes`

Créer un nouveau changement de pneus

#### **GET** `/tire-changes/:id`

Détails d'un changement de pneus

#### **PUT** `/tire-changes/:id`

Mettre à jour un changement de pneus

#### **DELETE** `/tire-changes/:id`

Supprimer un changement de pneus

---

### 🧼 Lavages

#### **GET** `/washing`

Liste tous les lavages

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "date": "ISO 8601 date",
      "type": "exterior | interior | complete | detailing",
      "cost": 25.0,
      "serviceProvider": "string",
      "location": "string",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/washing`

Créer un nouveau lavage

#### **GET** `/washing/:id`

Détails d'un lavage

#### **PUT** `/washing/:id`

Mettre à jour un lavage

#### **DELETE** `/washing/:id`

Supprimer un lavage

---

### ⛽ Carburant

#### **GET** `/fuel-consumptions`

Liste toutes les consommations de carburant

**Query Parameters:**

- `vehicleId`, `startDate`, `endDate`

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "date": "ISO 8601 date",
      "fuelType": "gasoline | diesel | electric | hybrid",
      "quantity": 45.5,
      "cost": 95.5,
      "mileage": 50000,
      "station": "string",
      "stationLocation": "string",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/fuel-consumptions`

Créer une nouvelle consommation de carburant

#### **GET** `/fuel-consumptions/:id`

Détails d'une consommation

#### **PUT** `/fuel-consumptions/:id`

Mettre à jour une consommation

#### **DELETE** `/fuel-consumptions/:id`

Supprimer une consommation

#### **GET** `/fuel-consumptions/statistics`

Statistiques de consommation de carburant

**Query Parameters:**

- `startDate`, `endDate`, `vehicleId`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "totalCost": 5250.0,
    "totalQuantity": 2500.5,
    "averageConsumption": 8.5,
    "averageCostPerLiter": 2.1,
    "byVehicle": [
      {
        "vehicleId": "string",
        "vehiclePlateNumber": "string",
        "totalCost": 1200.0,
        "totalQuantity": 550.0,
        "averageConsumption": 9.2
      }
    ],
    "byDay": [
      {
        "date": "2024-10-15",
        "totalCost": 95.5,
        "totalQuantity": 45.5
      }
    ],
    "byMonth": [
      {
        "month": "2024-10",
        "totalCost": 1250.0,
        "totalQuantity": 595.0
      }
    ]
  }
}
```

---

### 🛡️ Assurances

#### **GET** `/insurances`

Liste toutes les assurances

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "type": "comprehensive | third_party | collision",
      "company": "string",
      "policyNumber": "string",
      "startDate": "ISO 8601 date",
      "endDate": "ISO 8601 date",
      "premiumExcludingTax": 2016.0,
      "vatRate": 19,
      "vatAmount": 383.04,
      "fiscalStamp": 1.0,
      "otherTaxes": 0.0,
      "totalTaxAmount": 384.04,
      "premiumIncludingTax": 2400.04,
      "coverage": 80000.0,
      "deductible": 500.0,
      "status": "active | expired | cancelled",
      "agentName": "string",
      "agentPhone": "string",
      "notes": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **POST** `/insurances`

Créer une nouvelle assurance

#### **GET** `/insurances/:id`

Détails d'une assurance

#### **PUT** `/insurances/:id`

Mettre à jour une assurance

#### **DELETE** `/insurances/:id`

Supprimer une assurance

---

### 🔔 Alertes et Rappels

#### **GET** `/alerts`

Liste toutes les alertes

**Query Parameters:**

- `type`: technical_inspection | oil_change | insurance | license_expiry
- `priority`: low | medium | high
- `status`: pending | acknowledged | resolved

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "technical_inspection | oil_change | insurance | license_expiry",
      "title": "string",
      "message": "string",
      "priority": "low | medium | high",
      "status": "pending | acknowledged | resolved",
      "relatedId": "string",
      "relatedType": "string",
      "vehicleId": "string | null",
      "dueDate": "ISO 8601 date",
      "alertDate": "ISO 8601 date",
      "daysBefore": 7,
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

#### **PUT** `/alerts/:id/acknowledge`

Marquer une alerte comme acquittée

#### **PUT** `/alerts/:id/resolve`

Marquer une alerte comme résolue

---

### 📊 Dashboard et Statistiques

#### **GET** `/dashboard/stats`

Statistiques générales du dashboard

**Response 200:**

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

#### **GET** `/calendar/events`

Événements du calendrier

**Query Parameters:**

- `startDate`, `endDate`

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "start": "ISO 8601 date",
      "end": "ISO 8601 date",
      "type": "maintenance | oil_change | inspection | insurance",
      "vehicleId": "string",
      "description": "string",
      "status": "scheduled | completed | cancelled"
    }
  ]
}
```

---

### ❌ Gestion des Erreurs

Toutes les erreurs suivent ce format :

**Response 4xx/5xx:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur lisible",
    "details": {
      /* optionnel */
    }
  }
}
```

**Codes d'erreur communs:**

- `400`: BAD_REQUEST
- `401`: UNAUTHORIZED
- `403`: FORBIDDEN
- `404`: NOT_FOUND
- `409`: CONFLICT (ex: plaque d'immatriculation déjà existante)
- `422`: VALIDATION_ERROR
- `500`: INTERNAL_SERVER_ERROR

---

### 📝 Notes d'implémentation

1. **Authentification**: Toutes les routes (sauf `/auth/login`) nécessitent un token JWT dans le header `Authorization: Bearer {token}`

2. **Pagination**: Format standard pour toutes les listes

   - `page`: numéro de page (commence à 1)
   - `limit`: nombre d'éléments par page
   - Réponse inclut `pagination` object

3. **Dates**: Format ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

4. **Montants**: Toujours en TND (Dinar Tunisien), format décimal avec 2 décimales

5. **Recherche**: Le paramètre `search` effectue une recherche sur plusieurs champs pertinents

6. **Filtres**: Chaque endpoint de liste supporte des filtres spécifiques à l'entité

7. **CORS**: Le backend doit autoriser les requêtes depuis le domaine du frontend

8. **Rate Limiting**: Recommandé d'implémenter un rate limiting pour éviter les abus

9. **Logging**: Toutes les actions importantes doivent être loggées (création, modification, suppression)

10. **Validation**: Le backend doit valider toutes les données entrantes

## 🎨 Personnalisation

### Thème et couleurs

Les couleurs peuvent être modifiées dans `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Données de démonstration

Les données sont actuellement simulées dans chaque composant. Pour les remplacer par de vraies données API, modifiez les `useEffect` dans chaque page.

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :

- **Mobile**: Navigation hamburger, colonnes empilées
- **Tablet**: Layout adaptatif
- **Desktop**: Interface complète avec sidebar

## 🔒 Sécurité

- Authentification avec tokens JWT
- Routes protégées
- Gestion automatique de l'expiration des tokens
- Validation des données côté client
- Protection CSRF (à implémenter côté serveur)

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Prévisualisation

```bash
npm run preview
```

### Variables d'environnement pour la production

```env
VITE_API_URL=https://your-api-domain.com/api
```

## 📚 Documentation Complète

Ce projet dispose d'une documentation complète pour vous aider à déployer et intégrer le backend :

### 🚀 Déploiement

- **[DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)** - ⚡ Déploiement rapide en 3 étapes (START HERE!)
- **[DEPLOYMENT_OVH.md](DEPLOYMENT_OVH.md)** - Guide complet de déploiement sur VPS OVH
- **[CICD_PIPELINE.md](CICD_PIPELINE.md)** - Pipeline CI/CD automatisé (GitHub Actions, GitLab CI)
- **[deploy.sh](deploy.sh)** - Script de déploiement simple

### 💻 Backend & API

- **[BACKEND_NESTJS_GUIDE.md](BACKEND_NESTJS_GUIDE.md)** - ⭐ Guide complet NestJS + PostgreSQL (Recommandé)
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentation complète des APIs
- **[BACKEND_EXAMPLES.md](BACKEND_EXAMPLES.md)** - Exemples de code (Node.js, Python, PHP)
- **[BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)** - Guide d'intégration pas à pas
- **[BACKEND_QUICKSTART.md](BACKEND_QUICKSTART.md)** - Démarrage rapide en 5 minutes

### 📝 Autres

- **[CHANGELOG.md](CHANGELOG.md)** - Historique des modifications

**Total : 10 fichiers de documentation (~8,500 lignes, ~220 KB)**

---

## 📈 Améliorations futures

1. **PWA (Progressive Web App)**
2. **Notifications push**
3. **Mode hors ligne**
4. **Graphiques avancés** (Chart.js, D3.js)
5. **Export PDF/Excel**
6. **Intégration GPS** pour le suivi en temps réel
7. **Chat en temps réel** pour la communication
8. **Multi-tenancy** pour plusieurs entreprises

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub ou contactez l'équipe de développement.

---

**Développé avec ❤️ pour la gestion moderne de flottes de véhicules**
