import type {
  VehicleType,
  VehicleCategory,
  MaintenanceType,
  InsuranceType,
  OilType,
  InspectionType,
  InspectionResult,
} from "../types";

// Types de véhicules prédéfinis
export const VEHICLE_TYPES: {
  value: VehicleType;
  label: string;
  icon: string;
}[] = [
  { value: "car", label: "Voiture", icon: "🚗" },
  { value: "truck", label: "Camion", icon: "🚛" },
  { value: "van", label: "Van", icon: "🚐" },
  { value: "motorcycle", label: "Moto", icon: "🏍️" },
  { value: "bus", label: "Bus", icon: "🚌" },
  { value: "trailer", label: "Remorque", icon: "🚚" },
];

// Catégories de véhicules prédéfinies
export const VEHICLE_CATEGORIES: {
  value: VehicleCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "commercial",
    label: "Commercial",
    description: "Véhicules de transport de marchandises",
  },
  {
    value: "passenger",
    label: "Passagers",
    description: "Véhicules de transport de personnes",
  },
  {
    value: "utility",
    label: "Utilitaire",
    description: "Véhicules de service et d'entretien",
  },
  {
    value: "emergency",
    label: "Urgence",
    description: "Véhicules d'urgence et de secours",
  },
  {
    value: "construction",
    label: "BTP",
    description: "Véhicules de construction et travaux",
  },
  {
    value: "agricultural",
    label: "Agricole",
    description: "Véhicules agricoles et forestiers",
  },
];

// Types de carburant prédéfinis
export const FUEL_TYPES: { value: string; label: string; icon: string }[] = [
  { value: "gasoline", label: "Essence", icon: "⛽" },
  { value: "diesel", label: "Diesel", icon: "⛽" },
  { value: "electric", label: "Électrique", icon: "🔋" },
  { value: "hybrid", label: "Hybride", icon: "⚡" },
  { value: "lpg", label: "GPL", icon: "🔥" },
];

// Types de maintenance prédéfinis
export const MAINTENANCE_TYPES: {
  value: MaintenanceType;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "routine",
    label: "Maintenance Routinière",
    description: "Entretien régulier",
    color: "purple",
  },
  {
    value: "repair",
    label: "Réparation",
    description: "Réparation de panne",
    color: "red",
  },
  {
    value: "inspection",
    label: "Inspection",
    description: "Contrôle technique",
    color: "blue",
  },
  {
    value: "tire_change",
    label: "Changement de pneus",
    description: "Remplacement des pneus",
    color: "gray",
  },
  {
    value: "brake_service",
    label: "Service des freins",
    description: "Entretien du système de freinage",
    color: "orange",
  },
  {
    value: "engine_service",
    label: "Service moteur",
    description: "Entretien du moteur",
    color: "green",
  },
  {
    value: "transmission_service",
    label: "Service transmission",
    description: "Entretien de la transmission",
    color: "indigo",
  },
  {
    value: "electrical_service",
    label: "Service électrique",
    description: "Entretien du système électrique",
    color: "yellow",
  },
  {
    value: "air_conditioning_service",
    label: "Service climatisation",
    description: "Entretien de la climatisation",
    color: "cyan",
  },
  {
    value: "exhaust_service",
    label: "Service échappement",
    description: "Entretien du système d'échappement",
    color: "slate",
  },
];

// Types d'huile prédéfinis
export const OIL_TYPES: {
  value: OilType;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "synthetic",
    label: "Huile Synthétique",
    description: "Huile de haute qualité",
    color: "blue",
  },
  {
    value: "semi_synthetic",
    label: "Huile Semi-Synthétique",
    description: "Huile de qualité moyenne",
    color: "green",
  },
  {
    value: "mineral",
    label: "Huile Minérale",
    description: "Huile conventionnelle",
    color: "yellow",
  },
  {
    value: "diesel",
    label: "Huile Diesel",
    description: "Spéciale pour moteurs diesel",
    color: "orange",
  },
  {
    value: "gasoline",
    label: "Huile Essence",
    description: "Spéciale pour moteurs essence",
    color: "red",
  },
];

// Priorités de maintenance
export const MAINTENANCE_PRIORITIES: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Faible", color: "green" },
  { value: "medium", label: "Moyenne", color: "yellow" },
  { value: "high", label: "Élevée", color: "orange" },
  { value: "urgent", label: "Urgente", color: "red" },
];

// Types d'assurance prédéfinis
export const INSURANCE_TYPES: {
  value: InsuranceType;
  label: string;
  description: string;
}[] = [
  {
    value: "comprehensive",
    label: "Tous Risques",
    description: "Couverture complète",
  },
  {
    value: "third_party",
    label: "Tiers",
    description: "Responsabilité civile uniquement",
  },
  {
    value: "fire_theft",
    label: "Vol/Incendie",
    description: "Vol et incendie",
  },
  {
    value: "commercial",
    label: "Commerciale",
    description: "Assurance commerciale",
  },
];

// Marques de véhicules prédéfinies
export const VEHICLE_BRANDS: string[] = [
  "Mercedes-Benz",
  "Volkswagen",
  "Ford",
  "Renault",
  "Peugeot",
  "Citroën",
  "BMW",
  "Audi",
  "Toyota",
  "Nissan",
  "Hyundai",
  "Kia",
  "Fiat",
  "Iveco",
  "MAN",
  "Scania",
  "Volvo",
  "Dacia",
  "Opel",
  "Skoda",
];

// Couleurs de véhicules prédéfinies
export const VEHICLE_COLORS: string[] = [
  "Blanc",
  "Noir",
  "Gris",
  "Argent",
  "Bleu",
  "Rouge",
  "Vert",
  "Jaune",
  "Orange",
  "Marron",
  "Beige",
  "Violet",
];

// Statuts de véhicules
export const VEHICLE_STATUSES: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "active", label: "Actif", color: "green" },
  { value: "maintenance", label: "Maintenance", color: "yellow" },
  { value: "inactive", label: "Inactif", color: "red" },
];

// Statuts de maintenance
export const MAINTENANCE_STATUSES: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "scheduled", label: "Programmée", color: "yellow" },
  { value: "in_progress", label: "En cours", color: "blue" },
  { value: "completed", label: "Terminée", color: "green" },
  { value: "cancelled", label: "Annulée", color: "red" },
];

// Statuts d'assurance
export const INSURANCE_STATUSES: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "active", label: "Active", color: "green" },
  { value: "expired", label: "Expirée", color: "red" },
  { value: "cancelled", label: "Annulée", color: "gray" },
];

// Types de visite technique
export const INSPECTION_TYPES: {
  value: InspectionType;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "first_registration",
    label: "Première mise en circulation",
    description: "Contrôle technique initial",
    color: "blue",
  },
  {
    value: "periodic",
    label: "Visite périodique",
    description: "Contrôle technique obligatoire",
    color: "green",
  },
  {
    value: "additional",
    label: "Visite complémentaire",
    description: "Contrôle technique supplémentaire",
    color: "yellow",
  },
  {
    value: "pre_sale",
    label: "Avant vente",
    description: "Contrôle technique avant vente",
    color: "purple",
  },
  {
    value: "after_repair",
    label: "Après réparation",
    description: "Contrôle technique après réparation",
    color: "orange",
  },
];

// Résultats de visite technique
export const INSPECTION_RESULTS: {
  value: InspectionResult;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "favorable",
    label: "Favorable",
    description: "Véhicule conforme",
    color: "green",
  },
  {
    value: "favorable_with_restrictions",
    label: "Favorable avec restrictions",
    description: "Véhicule conforme avec limitations",
    color: "yellow",
  },
  {
    value: "unfavorable",
    label: "Défavorable",
    description: "Véhicule non conforme",
    color: "red",
  },
];

// Catégories de défauts
export const DEFECT_CATEGORIES: {
  value: string;
  label: string;
  description: string;
}[] = [
  {
    value: "braking_system",
    label: "Système de freinage",
    description: "Défauts liés au freinage",
  },
  {
    value: "steering_system",
    label: "Direction",
    description: "Défauts de direction",
  },
  {
    value: "suspension",
    label: "Suspension",
    description: "Défauts de suspension",
  },
  {
    value: "lights",
    label: "Éclairage",
    description: "Défauts d'éclairage",
  },
  {
    value: "emissions",
    label: "Émissions",
    description: "Défauts d'émissions polluantes",
  },
  {
    value: "tires",
    label: "Pneus",
    description: "Défauts de pneus",
  },
  {
    value: "bodywork",
    label: "Carrosserie",
    description: "Défauts de carrosserie",
  },
  {
    value: "safety_equipment",
    label: "Équipements de sécurité",
    description: "Défauts d'équipements de sécurité",
  },
];

// Gravité des défauts
export const DEFECT_SEVERITY: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "minor", label: "Mineur", color: "yellow" },
  { value: "major", label: "Majeur", color: "orange" },
  { value: "critical", label: "Critique", color: "red" },
];
