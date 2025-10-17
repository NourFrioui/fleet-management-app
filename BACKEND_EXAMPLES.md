# 🔧 Exemples de Code Backend - Fleet Management

Ce document fournit des exemples d'implémentation backend dans différents langages/frameworks.

---

## 📋 Table des Matières

1. [Node.js + Express + MongoDB](#nodejs--express--mongodb)
2. [Python + FastAPI + PostgreSQL](#python--fastapi--postgresql)
3. [PHP + Laravel + MySQL](#php--laravel--mysql)
4. [Structure de Projet Recommandée](#structure-de-projet-recommandée)

---

## 🟢 Node.js + Express + MongoDB

### Installation des Dépendances

```bash
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### Configuration de Base

```javascript
// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/vehicles", require("./routes/vehicles"));
app.use("/api/v1/drivers", require("./routes/drivers"));
app.use("/api/v1/maintenance", require("./routes/maintenance"));
app.use("/api/v1/oil-changes", require("./routes/oilChanges"));
app.use(
  "/api/v1/technical-inspections",
  require("./routes/technicalInspections")
);
app.use("/api/v1/tire-changes", require("./routes/tireChanges"));
app.use("/api/v1/washing", require("./routes/washing"));
app.use("/api/v1/fuel-consumptions", require("./routes/fuelConsumptions"));
app.use("/api/v1/insurances", require("./routes/insurances"));
app.use("/api/v1/alerts", require("./routes/alerts"));
app.use("/api/v1/dashboard", require("./routes/dashboard"));
app.use("/api/v1/calendar", require("./routes/calendar"));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Une erreur est survenue",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
```

### Modèle Mongoose (Exemple: Vehicle)

```javascript
// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    type: {
      type: String,
      enum: ["car", "truck", "van", "motorcycle", "bus", "trailer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "out_of_service"],
      default: "active",
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "electric", "hybrid"],
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentValue: {
      type: Number,
      min: 0,
    },
    insuranceExpiry: Date,
    technicalInspectionExpiry: Date,
    assignedDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les recherches
vehicleSchema.index({ plateNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1 });

// Méthode virtuelle pour calculer l'âge du véhicule
vehicleSchema.virtual("age").get(function () {
  return new Date().getFullYear() - this.year;
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
```

### Middleware d'Authentification

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Token d'authentification manquant",
        },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Utilisateur invalide ou inactif",
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "TOKEN_EXPIRED",
          message: "Token expiré",
        },
      });
    }

    res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_INVALID",
        message: "Token invalide",
      },
    });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Accès refusé",
        },
      });
    }
    next();
  };
};
```

### Route d'Authentification

```javascript
// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email et mot de passe requis",
        },
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email ou mot de passe incorrect",
        },
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email ou mot de passe incorrect",
        },
      });
    }

    // Générer les tokens
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Réponse
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la connexion",
      },
    });
  }
});

// GET /api/v1/auth/me
router.get("/me", authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

// POST /api/v1/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Refresh token manquant",
        },
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Utilisateur non trouvé",
        },
      });
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_INVALID",
        message: "Refresh token invalide",
      },
    });
  }
});

// POST /api/v1/auth/logout
router.post("/logout", authenticate, async (req, res) => {
  // Dans un système plus avancé, on invaliderait le token ici
  // (blacklist, Redis, etc.)

  res.json({
    success: true,
    message: "Déconnexion réussie",
  });
});

module.exports = router;
```

### Route Véhicules

```javascript
// routes/vehicles.js
const express = require("express");
const Vehicle = require("../models/Vehicle");
const { authenticate, authorize } = require("../middleware/auth");
const { validateVehicle } = require("../validators/vehicle");

const router = express.Router();

// GET /api/v1/vehicles
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;

    const query = {};

    // Recherche
    if (search) {
      query.$or = [
        { plateNumber: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    // Filtres
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    // Exécuter les requêtes en parallèle
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate("assignedDriverId", "name email")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
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
    console.error("Erreur GET vehicles:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des véhicules",
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
            details: error.details.map((d) => d.message),
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

      // Créer le véhicule
      const vehicle = new Vehicle(req.body);
      await vehicle.save();

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      console.error("Erreur POST vehicle:", error);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Erreur lors de la création du véhicule",
        },
      });
    }
  }
);

// GET /api/v1/vehicles/:id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "assignedDriverId",
      "name email phone"
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Véhicule non trouvé",
        },
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Erreur GET vehicle by ID:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération du véhicule",
      },
    });
  }
});

// PUT /api/v1/vehicles/:id
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Véhicule non trouvé",
          },
        });
      }

      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      console.error("Erreur PUT vehicle:", error);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Erreur lors de la mise à jour du véhicule",
        },
      });
    }
  }
);

// DELETE /api/v1/vehicles/:id
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Véhicule non trouvé",
        },
      });
    }

    res.json({
      success: true,
      message: "Véhicule supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE vehicle:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la suppression du véhicule",
      },
    });
  }
});

module.exports = router;
```

### CRON Job pour les Alertes

```javascript
// jobs/alertsGenerator.js
const cron = require("node-cron");
const Alert = require("../models/Alert");
const TechnicalInspection = require("../models/TechnicalInspection");
const OilChange = require("../models/OilChange");
const Insurance = require("../models/Insurance");
const Driver = require("../models/Driver");

// Exécuter tous les jours à 8h du matin
cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Génération des alertes...");
  await generateAlerts();
});

async function generateAlerts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Supprimer les anciennes alertes non résolues
  await Alert.deleteMany({
    status: "pending",
    dueDate: { $lt: today },
  });

  // Générer alertes pour visites techniques
  await generateTechnicalInspectionAlerts(today);

  // Générer alertes pour vidanges
  await generateOilChangeAlerts(today);

  // Générer alertes pour assurances
  await generateInsuranceAlerts(today);

  // Générer alertes pour permis de conduire
  await generateLicenseExpiryAlerts(today);

  console.log("✅ Alertes générées avec succès");
}

async function generateTechnicalInspectionAlerts(today) {
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
      // Vérifier si l'alerte n'existe pas déjà
      const existingAlert = await Alert.findOne({
        type: "technical_inspection",
        relatedId: inspection._id,
        daysBefore: daysUntilExpiry,
      });

      if (!existingAlert) {
        await Alert.create({
          type: "technical_inspection",
          title:
            daysUntilExpiry === 3
              ? "Visite Technique URGENTE"
              : "Visite Technique à Effectuer",
          message: `La visite technique expire dans ${daysUntilExpiry} jour(s)`,
          priority: daysUntilExpiry === 3 ? "high" : "medium",
          relatedId: inspection._id,
          relatedType: "technical_inspection",
          vehicleId: inspection.vehicleId,
          dueDate: inspection.expiryDate,
          alertDate: today,
          daysBefore: daysUntilExpiry,
          status: "pending",
        });
      }
    }
  }
}

// Fonctions similaires pour les autres types d'alertes...

module.exports = { generateAlerts };
```

---

## 🐍 Python + FastAPI + PostgreSQL

### Installation

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose bcrypt python-dotenv pydantic
```

### Configuration de Base

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import engine, SessionLocal, Base
from routers import auth, vehicles, drivers, maintenance

load_dotenv()

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fleet Management API",
    version="1.0.0",
    description="API de gestion de flotte de véhicules"
)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency pour la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(vehicles.router, prefix="/api/v1/vehicles", tags=["vehicles"])
app.include_router(drivers.router, prefix="/api/v1/drivers", tags=["drivers"])
app.include_router(maintenance.router, prefix="/api/v1/maintenance", tags=["maintenance"])

@app.get("/")
def read_root():
    return {"message": "Fleet Management API - Version 1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### Database Configuration

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost/fleet_management"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### Modèle SQLAlchemy (Exemple: Vehicle)

```python
# models/vehicle.py
from sqlalchemy import Column, String, Integer, Float, Date, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.sql import func
from database import Base
import enum

class VehicleType(str, enum.Enum):
    CAR = "car"
    TRUCK = "truck"
    VAN = "van"
    MOTORCYCLE = "motorcycle"
    BUS = "bus"
    TRAILER = "trailer"

class VehicleStatus(str, enum.Enum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    OUT_OF_SERVICE = "out_of_service"

class FuelType(str, enum.Enum):
    GASOLINE = "gasoline"
    DIESEL = "diesel"
    ELECTRIC = "electric"
    HYBRID = "hybrid"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, nullable=False, index=True)
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    type = Column(SQLEnum(VehicleType), nullable=False)
    status = Column(SQLEnum(VehicleStatus), default=VehicleStatus.ACTIVE)
    mileage = Column(Integer, default=0)
    fuel_type = Column(SQLEnum(FuelType), nullable=False)
    purchase_date = Column(Date, nullable=False)
    purchase_price = Column(Float, nullable=False)
    current_value = Column(Float)
    insurance_expiry = Column(Date)
    technical_inspection_expiry = Column(Date)
    assigned_driver_id = Column(String, ForeignKey("drivers.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Schémas Pydantic

```python
# schemas/vehicle.py
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from enum import Enum

class VehicleType(str, Enum):
    CAR = "car"
    TRUCK = "truck"
    VAN = "van"
    MOTORCYCLE = "motorcycle"
    BUS = "bus"
    TRAILER = "trailer"

class VehicleStatus(str, Enum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    OUT_OF_SERVICE = "out_of_service"

class VehicleBase(BaseModel):
    plate_number: str = Field(..., max_length=20)
    brand: str
    model: str
    year: int = Field(..., ge=1900, le=2030)
    type: VehicleType
    fuel_type: str
    purchase_date: date
    purchase_price: float = Field(..., ge=0)
    mileage: Optional[int] = 0
    status: Optional[VehicleStatus] = VehicleStatus.ACTIVE

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    plate_number: Optional[str]
    status: Optional[VehicleStatus]
    mileage: Optional[int]

class VehicleResponse(VehicleBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
```

### Authentification JWT

```python
# auth.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={
            "success": False,
            "error": {
                "code": "UNAUTHORIZED",
                "message": "Invalid authentication credentials"
            }
        },
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
```

---

## 🐘 PHP + Laravel + MySQL

### Installation

```bash
composer create-project laravel/laravel fleet-management-api
cd fleet-management-api
composer require tymon/jwt-auth
```

### Configuration de l'API

```php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;

Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Vehicle routes
        Route::apiResource('vehicles', VehicleController::class);

        // Driver routes
        Route::apiResource('drivers', DriverController::class);
    });
});
```

### Modèle Eloquent (Exemple: Vehicle)

```php
// app/Models/Vehicle.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number',
        'brand',
        'model',
        'year',
        'type',
        'status',
        'mileage',
        'fuel_type',
        'purchase_date',
        'purchase_price',
        'current_value',
        'insurance_expiry',
        'technical_inspection_expiry',
        'assigned_driver_id'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'insurance_expiry' => 'date',
        'technical_inspection_expiry' => 'date',
        'year' => 'integer',
        'mileage' => 'integer',
        'purchase_price' => 'decimal:2',
        'current_value' => 'decimal:2'
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }
}
```

### Controller

```php
// app/Http/Controllers/VehicleController.php
<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('plate_number', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        // Pagination
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);

        $vehicles = $query->with('driver')->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $vehicles->items(),
            'pagination' => [
                'page' => $vehicles->currentPage(),
                'limit' => $vehicles->perPage(),
                'total' => $vehicles->total(),
                'totalPages' => $vehicles->lastPage()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plate_number' => 'required|unique:vehicles|max:20',
            'brand' => 'required|string|max:50',
            'model' => 'required|string|max:50',
            'year' => 'required|integer|min:1900|max:2030',
            'type' => 'required|in:car,truck,van,motorcycle,bus,trailer',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid',
            'purchase_date' => 'required|date',
            'purchase_price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Données invalides',
                    'details' => $validator->errors()
                ]
            ], 422);
        }

        $vehicle = Vehicle::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ], 201);
    }

    public function show($id)
    {
        $vehicle = Vehicle::with('driver')->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Véhicule non trouvé'
                ]
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ]);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Véhicule non trouvé'
                ]
            ], 404);
        }

        $vehicle->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ]);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Véhicule non trouvé'
                ]
            ], 404);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès'
        ]);
    }
}
```

---

## 📁 Structure de Projet Recommandée

### Node.js + Express

```
fleet-management-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Driver.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehicles.js
│   │   ├── drivers.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── validators/
│   │   ├── vehicle.js
│   │   └── ...
│   ├── jobs/
│   │   └── alertsGenerator.js
│   └── utils/
│       ├── response.js
│       └── helpers.js
├── .env
├── .env.example
├── package.json
└── server.js
```

---

**Créé pour Fleet Management App - Backend Examples**
**Dernière mise à jour : Octobre 2025**
