# 🚛 Fleet Management App

> Une application web complète et moderne pour la gestion de flottes de véhicules, développée avec React, TypeScript et TailwindCSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg)](https://vitejs.dev/)

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Intégration Backend](#-intégration-backend)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

## 🎯 À propos

Fleet Management App est une application web complète permettant de gérer efficacement une flotte de véhicules. Elle offre une solution tout-en-un pour le suivi des véhicules, des chauffeurs, des maintenances, de la consommation de carburant, des assurances et bien plus encore.

## ✨ Fonctionnalités

### 🔐 Authentification et Sécurité
- ✅ Système d'authentification complet avec JWT
- ✅ Gestion de session utilisateur
- ✅ Routes protégées
- ✅ Gestion des rôles (admin, manager, operator)
- ✅ Profil utilisateur avec modification des informations

### 🚗 Gestion des Véhicules
- ✅ CRUD complet pour les véhicules
- ✅ Suivi du kilométrage et des statuts
- ✅ Filtres avancés et recherche
- ✅ Gestion des fichiers attachés (documents, images, factures)
- ✅ Assignation aux chauffeurs
- ✅ Historique complet des opérations

### 👥 Gestion des Chauffeurs
- ✅ Gestion complète des profils de chauffeurs
- ✅ Suivi des permis de conduire avec dates d'expiration
- ✅ Gestion des statuts (actif, inactif, suspendu)
- ✅ Assignation aux véhicules
- ✅ Historique et détails complets

### 🔧 Maintenance et Entretien
- ✅ **Maintenances** : Planification, suivi des coûts, gestion des pièces détachées
- ✅ **Vidanges** : Suivi des changements d'huile avec rappels automatiques
- ✅ **Visites techniques** : Gestion des inspections avec suivi des défauts
- ✅ **Changements de pneus** : Suivi par position (AVD, AVG, ARD, ARG)
- ✅ **Lavages** : Enregistrement des coûts de nettoyage
- ✅ Historique complet de toutes les opérations

### ⛽ Gestion du Carburant
- ✅ Enregistrement des consommations
- ✅ Calcul automatique des coûts
- ✅ Statistiques détaillées (quotidiennes, mensuelles, par véhicule)
- ✅ Analyse de la consommation (L/100km)
- ✅ Gestion des cartes carburant
- ✅ Graphiques de performance

### 🛡️ Assurances
- ✅ Gestion des polices d'assurance
- ✅ Calcul automatique des taxes (TVA, timbre fiscal)
- ✅ Alertes pour les échéances
- ✅ Suivi des dates d'expiration
- ✅ Historique complet

### 📊 Dashboard et Analytics
- ✅ Dashboard interactif avec statistiques en temps réel
- ✅ Graphiques de consommation de carburant (Recharts)
- ✅ Analyse des coûts de maintenance
- ✅ Répartition des véhicules par type et statut
- ✅ Indicateurs de performance (KPIs)
- ✅ Statistiques mensuelles et annuelles
- ✅ Graphiques de performance des chauffeurs

### 📅 Calendrier
- ✅ Calendrier intégré (react-big-calendar) pour visualiser tous les événements
- ✅ Planification des maintenances préventives
- ✅ Vue mensuelle, hebdomadaire et quotidienne
- ✅ Légende colorée par type d'événement

### 🔔 Système d'Alertes
- ✅ Notifications pour les échéances approchantes
- ✅ Alertes prioritaires (haute, moyenne, basse)
- ✅ Gestion des statuts d'alertes
- ✅ Rappels automatiques (assurances, visites techniques, permis, maintenances)

### 📁 Gestion des Fichiers
- ✅ Upload et gestion de documents attachés aux véhicules
- ✅ Catégorisation des fichiers (documents, images, factures, certificats)
- ✅ Système de tags pour faciliter la recherche

### 🎨 Interface Utilisateur
- ✅ Design moderne et responsive (mobile-first)
- ✅ Navigation intuitive avec sidebar
- ✅ Recherche avancée et filtres multiples
- ✅ Formulaires validés avec gestion d'erreurs
- ✅ Thème personnalisable

## 🛠️ Technologies utilisées

- **Frontend Framework** : [React](https://react.dev/) 19.1
- **Language** : [TypeScript](https://www.typescriptlang.org/) 5.9
- **Build Tool** : [Vite](https://vitejs.dev/) 7.1
- **Styling** : [TailwindCSS](https://tailwindcss.com/) 3.4
- **Routing** : [React Router](https://reactrouter.com/) 7.9
- **État** : React Context API
- **HTTP Client** : [Axios](https://axios-http.com/) 1.12
- **Calendrier** : [react-big-calendar](https://github.com/jquense/react-big-calendar) + [moment](https://momentjs.com/)
- **Graphiques** : [Recharts](https://recharts.org/) 3.2
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Linting** : ESLint 9.36



## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Votre Nom**

- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 🙏 Remerciements

- [React](https://react.dev/) - Bibliothèque UI
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Recharts](https://recharts.org/) - Bibliothèque de graphiques
- [react-big-calendar](https://github.com/jquense/react-big-calendar) - Composant calendrier

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !
