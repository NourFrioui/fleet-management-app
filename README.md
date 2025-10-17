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

L'application est prête pour l'intégration avec un backend REST. Les services API sont configurés dans `src/services/api.ts` avec :

- Configuration Axios avec intercepteurs
- Gestion automatique des tokens d'authentification
- Services pour toutes les entités (véhicules, chauffeurs, maintenance, carburant)
- Gestion des erreurs et redirection automatique

### Endpoints API attendus

```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh

GET    /api/vehicles
POST   /api/vehicles
GET    /api/vehicles/:id
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

GET    /api/drivers
POST   /api/drivers
GET    /api/drivers/:id
PUT    /api/drivers/:id
DELETE /api/drivers/:id

GET    /api/maintenance
POST   /api/maintenance
GET    /api/maintenance/:id
PUT    /api/maintenance/:id
DELETE /api/maintenance/:id

GET    /api/fuel
POST   /api/fuel
GET    /api/fuel/:id
PUT    /api/fuel/:id
DELETE /api/fuel/:id

GET /api/dashboard/stats
GET /api/calendar/events
```

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
