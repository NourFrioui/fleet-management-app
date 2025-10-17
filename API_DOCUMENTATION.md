# 📚 Documentation API Backend - Fleet Management

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Configuration](#configuration)
3. [Authentification](#authentification)
4. [Endpoints par Module](#endpoints-par-module)
5. [Modèles de Données](#modèles-de-données)
6. [Codes d'Erreur](#codes-derreur)
7. [Exemples d'Intégration](#exemples-dintégration)

---

## 🎯 Introduction

Cette documentation décrit l'ensemble des APIs REST nécessaires pour le backend de l'application Fleet Management.

### Technologies Recommandées pour le Backend

- **Node.js** avec Express.js ou NestJS
- **Python** avec Django REST Framework ou FastAPI
- **PHP** avec Laravel
- **Java** avec Spring Boot

### Base URL

```
Production: https://api.votredomaine.tn/api/v1
Development: http://localhost:8000/api/v1
Staging: https://staging-api.votredomaine.tn/api/v1
```

---

## ⚙️ Configuration

### Variables d'Environnement Nécessaires

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_management
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://fleet.votredomaine.tn

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/uploads

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password

# API
API_VERSION=v1
PORT=8000
```

### Headers Requis

Toutes les requêtes (sauf login) doivent inclure :

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

---

## 🔐 Authentification

### Flow d'Authentification

1. **Login** → Obtenir token JWT + refresh token
2. **Utiliser le token** dans toutes les requêtes
3. **Refresh** le token avant expiration
4. **Logout** pour invalider les tokens

### Implémentation JWT

**Token Payload:**

```json
{
  "userId": "string",
  "email": "string",
  "role": "admin | manager | driver",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Validation:**

- Vérifier la signature du token
- Vérifier l'expiration
- Vérifier que l'utilisateur existe toujours
- Vérifier les permissions selon le rôle

---

## 📦 Modèles de Données

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashé avec bcrypt
  role: "admin" | "manager" | "driver";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Vehicle

```typescript
interface Vehicle {
  id: string;
  plateNumber: string; // UNIQUE
  brand: string;
  model: string;
  year: number;
  type: "car" | "truck" | "van" | "motorcycle" | "bus" | "trailer";
  status: "active" | "maintenance" | "out_of_service";
  mileage: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  insuranceExpiry?: Date;
  technicalInspectionExpiry?: Date;
  assignedDriverId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Driver

```typescript
interface Driver {
  id: string;
  name: string;
  email: string; // UNIQUE
  phone: string;
  licenseNumber: string; // UNIQUE
  licenseExpiry: Date;
  status: "available" | "on_trip" | "on_leave" | "inactive";
  hireDate: Date;
  assignedVehicleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Maintenance

```typescript
interface Maintenance {
  id: string;
  vehicleId: string; // FOREIGN KEY
  type: "preventive" | "corrective" | "inspection";
  scheduledDate: Date;
  completedDate?: Date;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  description: string;
  cost: number;
  mileage: number;
  serviceProvider: string;
  partsReplaced: string[]; // Array JSON
  laborHours: number;
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### OilChange

```typescript
interface OilChange {
  id: string;
  vehicleId: string; // FOREIGN KEY
  scheduledDate: Date;
  completedDate?: Date;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  cost: number;
  mileage: number;
  oilType: "synthetic" | "semi_synthetic" | "mineral" | "diesel";
  oilQuantity: number;
  oilBrand: string;
  filterChanged: boolean;
  filterBrand?: string;
  nextOilChangeMileage: number;
  nextOilChangeDate: Date;
  technician: string;
  serviceCenter: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TechnicalInspection

```typescript
interface TechnicalInspection {
  id: string;
  vehicleId: string; // FOREIGN KEY
  inspectionType: "periodic" | "pre_purchase" | "post_repair";
  inspectionDate: Date;
  expiryDate: Date;
  result:
    | "favorable"
    | "favorable_with_restrictions"
    | "unfavorable"
    | "pending";
  mileage: number;
  cost: number;
  inspectorName: string;
  inspectionCenter: string;
  centerAddress: string;
  centerPhone: string;
  responsible?: string;
  nextInspectionDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TireChange

```typescript
interface TireChange {
  id: string;
  vehicleId: string; // FOREIGN KEY
  date: Date;
  position: "AVD" | "AVG" | "ARD" | "ARG" | "ALL";
  tireBrand: string;
  tireModel: string;
  tireSize: string;
  cost: number;
  mileage: number;
  serviceProvider: string;
  warranty?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Washing

```typescript
interface Washing {
  id: string;
  vehicleId: string; // FOREIGN KEY
  date: Date;
  type: "exterior" | "interior" | "complete" | "detailing";
  cost: number;
  serviceProvider: string;
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### FuelConsumption

```typescript
interface FuelConsumption {
  id: string;
  vehicleId: string; // FOREIGN KEY
  date: Date;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  quantity: number; // Litres
  cost: number; // TND
  mileage: number;
  station: string;
  stationLocation: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Insurance

```typescript
interface Insurance {
  id: string;
  vehicleId: string; // FOREIGN KEY
  type: "comprehensive" | "third_party" | "collision";
  company: string;
  policyNumber: string; // UNIQUE
  startDate: Date;
  endDate: Date;
  premiumExcludingTax: number; // Prix HT
  vatRate: number; // Pourcentage (19 par défaut)
  vatAmount: number; // Calculé
  fiscalStamp: number; // Timbre fiscal (1 TND)
  otherTaxes: number;
  totalTaxAmount: number; // Calculé
  premiumIncludingTax: number; // Prix TTC
  coverage: number; // Montant de la couverture
  deductible: number; // Franchise
  status: "active" | "expired" | "cancelled";
  agentName: string;
  agentPhone: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Alert

```typescript
interface Alert {
  id: string;
  type: "technical_inspection" | "oil_change" | "insurance" | "license_expiry";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "acknowledged" | "resolved";
  relatedId: string; // ID de l'entité concernée
  relatedType: string; // Type de l'entité
  vehicleId?: string;
  dueDate: Date; // Date d'échéance
  alertDate: Date; // Date de l'alerte
  daysBefore: number; // Nombre de jours avant l'échéance
  createdAt: Date;
  updatedAt: Date;
}
```

### FileAttachment

```typescript
interface FileAttachment {
  id: string;
  vehicleId: string; // FOREIGN KEY
  fileName: string;
  fileType: string; // MIME type
  fileSize: number; // bytes
  fileUrl: string; // URL du fichier
  uploadedBy: string; // User ID
  uploadedAt: Date;
}
```

---

## 🔍 Schéma de Base de Données Recommandé

### Relations

```sql
-- Véhicules
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel_type VARCHAR(20) NOT NULL,
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2),
  insurance_expiry DATE,
  technical_inspection_expiry DATE,
  assigned_driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chauffeurs
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  hire_date DATE NOT NULL,
  assigned_vehicle_id UUID REFERENCES vehicles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance
CREATE TABLE maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  service_provider VARCHAR(100) NOT NULL,
  parts_replaced JSONB,
  labor_hours DECIMAL(5,2),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vidanges
CREATE TABLE oil_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  cost DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  oil_type VARCHAR(20) NOT NULL,
  oil_quantity DECIMAL(5,2) NOT NULL,
  oil_brand VARCHAR(50) NOT NULL,
  filter_changed BOOLEAN DEFAULT false,
  filter_brand VARCHAR(50),
  next_oil_change_mileage INTEGER,
  next_oil_change_date DATE,
  technician VARCHAR(100),
  service_center VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visites Techniques
CREATE TABLE technical_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  inspection_type VARCHAR(20) NOT NULL,
  inspection_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  result VARCHAR(50) NOT NULL,
  mileage INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  inspector_name VARCHAR(100),
  inspection_center VARCHAR(100),
  center_address VARCHAR(200),
  center_phone VARCHAR(20),
  responsible VARCHAR(100),
  next_inspection_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Changements de Pneus
CREATE TABLE tire_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  position VARCHAR(10) NOT NULL,
  tire_brand VARCHAR(50) NOT NULL,
  tire_model VARCHAR(50),
  tire_size VARCHAR(20),
  cost DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  service_provider VARCHAR(100),
  warranty VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lavages
CREATE TABLE washing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  service_provider VARCHAR(100),
  location VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consommations de Carburant
CREATE TABLE fuel_consumptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  station VARCHAR(100),
  station_location VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assurances
CREATE TABLE insurances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  company VARCHAR(100) NOT NULL,
  policy_number VARCHAR(50) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  premium_excluding_tax DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 19.00,
  vat_amount DECIMAL(10,2) NOT NULL,
  fiscal_stamp DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  other_taxes DECIMAL(10,2) DEFAULT 0.00,
  total_tax_amount DECIMAL(10,2) NOT NULL,
  premium_including_tax DECIMAL(10,2) NOT NULL,
  coverage DECIMAL(10,2),
  deductible DECIMAL(10,2),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  agent_name VARCHAR(100),
  agent_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alertes
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  related_id UUID NOT NULL,
  related_type VARCHAR(50) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  due_date DATE NOT NULL,
  alert_date DATE NOT NULL,
  days_before INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fichiers Attachés
CREATE TABLE file_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,
  file_url VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_maintenance_vehicle ON maintenance(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_fuel_vehicle ON fuel_consumptions(vehicle_id);
CREATE INDEX idx_fuel_date ON fuel_consumptions(date);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_priority ON alerts(priority);
```

---

## ⚠️ Codes d'Erreur

### Format Standard

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible",
    "details": {}
  }
}
```

### Liste des Codes

| Code                  | HTTP | Description                             |
| --------------------- | ---- | --------------------------------------- |
| `INVALID_CREDENTIALS` | 401  | Email ou mot de passe incorrect         |
| `TOKEN_EXPIRED`       | 401  | Token JWT expiré                        |
| `TOKEN_INVALID`       | 401  | Token JWT invalide                      |
| `UNAUTHORIZED`        | 401  | Non authentifié                         |
| `FORBIDDEN`           | 403  | Accès refusé                            |
| `NOT_FOUND`           | 404  | Ressource non trouvée                   |
| `DUPLICATE_ENTRY`     | 409  | Entrée dupliquée (ex: plaque existante) |
| `VALIDATION_ERROR`    | 422  | Erreur de validation des données        |
| `INTERNAL_ERROR`      | 500  | Erreur serveur interne                  |

---

## 🔄 Logique Métier Importante

### Génération Automatique des Alertes

Le backend doit générer automatiquement des alertes pour :

1. **Visite Technique** : 7 jours et 3 jours avant l'expiration
2. **Vidange** : 7 jours et 3 jours avant la date prévue
3. **Assurance** : 30 jours, 7 jours et 3 jours avant l'expiration
4. **Permis de Conduire** : 30 jours et 7 jours avant l'expiration

**Implémentation suggérée (CRON Job):**

```javascript
// Exemple avec Node.js et node-cron
const cron = require("node-cron");

// Exécuter tous les jours à 8h du matin
cron.schedule("0 8 * * *", async () => {
  await generateAlerts();
});

async function generateAlerts() {
  const today = new Date();

  // Vérifier les visites techniques
  const inspections = await TechnicalInspection.find({
    expiryDate: {
      $gte: today,
      $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  for (const inspection of inspections) {
    const daysUntilExpiry = Math.ceil(
      (inspection.expiryDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry === 7 || daysUntilExpiry === 3) {
      await Alert.create({
        type: "technical_inspection",
        title:
          daysUntilExpiry === 3
            ? "Visite Technique URGENTE"
            : "Visite Technique à Effectuer",
        message: `La visite technique expire dans ${daysUntilExpiry} jour(s)`,
        priority: daysUntilExpiry === 3 ? "high" : "medium",
        relatedId: inspection.id,
        relatedType: "technical_inspection",
        vehicleId: inspection.vehicleId,
        dueDate: inspection.expiryDate,
        alertDate: today,
        daysBefore: daysUntilExpiry,
      });
    }
  }

  // Répéter pour les autres types d'alertes...
}
```

### Calcul des Statistiques de Carburant

```javascript
async function calculateFuelStatistics(startDate, endDate, vehicleId = null) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
  };

  if (vehicleId) {
    query.vehicleId = vehicleId;
  }

  const consumptions = await FuelConsumption.find(query);

  const totalCost = consumptions.reduce((sum, c) => sum + c.cost, 0);
  const totalQuantity = consumptions.reduce((sum, c) => sum + c.quantity, 0);
  const averageCostPerLiter = totalCost / totalQuantity;

  // Calcul de la consommation moyenne (litres/100km)
  const sortedConsumptions = consumptions.sort((a, b) => a.mileage - b.mileage);
  const totalDistance =
    sortedConsumptions[sortedConsumptions.length - 1].mileage -
    sortedConsumptions[0].mileage;
  const averageConsumption = (totalQuantity / totalDistance) * 100;

  return {
    totalCost,
    totalQuantity,
    averageCostPerLiter,
    averageConsumption,
  };
}
```

---

## 📱 Exemples d'Intégration

### Exemple avec Axios (Frontend)

```typescript
// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de le rafraîchir
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem("token", data.data.token);

          // Réessayer la requête originale
          error.config.headers.Authorization = `Bearer ${data.data.token}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh token invalide, déconnecter l'utilisateur
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Exemple avec Express (Backend Node.js)

```javascript
// routes/vehicles.js
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const Vehicle = require("../models/Vehicle");

// GET /api/v1/vehicles
router.get("/", authenticate, async (req, res) => {
  try {
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

    const skip = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).skip(skip).limit(parseInt(limit)),
      Vehicle.countDocuments(query),
    ]);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des véhicules",
        details: error.message,
      },
    });
  }
});

// POST /api/v1/vehicles
router.post(
  "/",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      // Validation
      const { error } = validateVehicle(req.body);
      if (error) {
        return res.status(422).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Données invalides",
            details: error.details,
          },
        });
      }

      // Vérifier si la plaque existe déjà
      const existing = await Vehicle.findOne({
        plateNumber: req.body.plateNumber,
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          error: {
            code: "DUPLICATE_ENTRY",
            message: "Ce numéro de plaque existe déjà",
          },
        });
      }

      const vehicle = new Vehicle(req.body);
      await vehicle.save();

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Erreur lors de la création du véhicule",
          details: error.message,
        },
      });
    }
  }
);

module.exports = router;
```

---

## 🔒 Sécurité

### Recommandations

1. **Hasher les mots de passe** avec bcrypt (min 10 rounds)
2. **Valider toutes les entrées** côté serveur
3. **Utiliser HTTPS** en production
4. **Implémenter un rate limiting** (ex: 100 requêtes/minute)
5. **Activer CORS** uniquement pour les domaines autorisés
6. **Logger toutes les actions sensibles**
7. **Implémenter une politique de mot de passe forte**
8. **Mettre en place une 2FA** (optionnel)
9. **Sauvegarder les fichiers** dans un système de stockage sécurisé (S3, etc.)
10. **Implémenter une rotation des tokens JWT**

---

## 📊 Performance

### Optimisations Recommandées

1. **Indexes de base de données** sur les champs souvent utilisés dans les filtres
2. **Cache** pour les données fréquemment consultées (Redis)
3. **Pagination** sur toutes les listes
4. **Compression gzip** des réponses
5. **CDN** pour les fichiers statiques
6. **Connection pooling** pour la base de données
7. **Queries optimisées** (éviter N+1 queries)

---

## 📝 Notes Finales

- Tous les montants sont en **TND (Dinar Tunisien)**
- Toutes les dates sont au format **ISO 8601**
- Les IDs utilisent le format **UUID v4**
- La pagination commence à **page 1**
- Le code doit suivre les **conventions REST**
- Implémenter des **tests unitaires** et **d'intégration**
- Documenter le code avec **JSDoc** ou équivalent
- Utiliser un **linter** (ESLint, Pylint, etc.)

---

**Document créé pour Fleet Management App - Version 1.0**
**Dernière mise à jour : Octobre 2025**
