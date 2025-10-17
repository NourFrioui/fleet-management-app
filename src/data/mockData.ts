// Données de démonstration complètes pour l'application Fleet Management
import type {
  Vehicle,
  Driver,
  Maintenance,
  OilChange,
  TechnicalInspection,
  FuelConsumption,
  DashboardStats,
  CalendarEvent,
} from "../types";

// Données des véhicules
export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plateNumber: "123 TU 1234",
    brand: "Mercedes",
    model: "Sprinter",
    year: 2022,
    type: "van",
    category: "commercial",
    status: "active",
    mileage: 45000,
    fuelType: "diesel",
    color: "Blanc",
    purchaseDate: "2022-01-15",
    lastMaintenanceDate: "2024-01-15",
    nextMaintenanceDate: "2024-04-15",
    assignedDriverId: "1",
    fuelCardNumber: "FC001",
    createdAt: "2022-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    plateNumber: "456 TU 7890",
    brand: "Volvo",
    model: "FH16",
    year: 2021,
    type: "truck",
    category: "commercial",
    status: "maintenance",
    mileage: 125000,
    fuelType: "diesel",
    color: "Rouge",
    purchaseDate: "2021-03-20",
    lastMaintenanceDate: "2024-01-10",
    nextMaintenanceDate: "2024-02-10",
    assignedDriverId: "2",
    fuelCardNumber: "FC002",
    createdAt: "2021-03-20T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    plateNumber: "789 TU 4567",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    type: "car",
    category: "passenger",
    status: "active",
    mileage: 25000,
    fuelType: "gasoline",
    color: "Noir",
    purchaseDate: "2023-06-01",
    lastMaintenanceDate: "2024-01-05",
    nextMaintenanceDate: "2024-04-05",
    assignedDriverId: "3",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "4",
    plateNumber: "234 TU 8901",
    brand: "Ford",
    model: "Transit",
    year: 2022,
    type: "van",
    category: "utility",
    status: "active",
    mileage: 38000,
    fuelType: "diesel",
    color: "Bleu",
    purchaseDate: "2022-08-10",
    lastMaintenanceDate: "2024-01-20",
    nextMaintenanceDate: "2024-03-20",
    assignedDriverId: "4",
    fuelCardNumber: "FC004",
    createdAt: "2022-08-10T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "5",
    plateNumber: "567 TU 2345",
    brand: "Scania",
    model: "R450",
    year: 2020,
    type: "truck",
    category: "commercial",
    status: "active",
    mileage: 180000,
    fuelType: "diesel",
    color: "Gris",
    purchaseDate: "2020-11-05",
    lastMaintenanceDate: "2024-01-08",
    nextMaintenanceDate: "2024-02-08",
    assignedDriverId: "5",
    fuelCardNumber: "FC005",
    createdAt: "2020-11-05T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "6",
    plateNumber: "890 TU 6789",
    brand: "BMW",
    model: "X5",
    year: 2023,
    type: "car",
    category: "passenger",
    status: "inactive",
    mileage: 15000,
    fuelType: "gasoline",
    color: "Argent",
    purchaseDate: "2023-09-15",
    lastMaintenanceDate: "2024-01-12",
    nextMaintenanceDate: "2024-04-12",
    createdAt: "2023-09-15T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
];

// Données des chauffeurs
export const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Mohamed Ben Ali",
    email: "mohamed.benali@fleet.tn",
    phone: "+216 22 123 456",
    licenseNumber: "DL123456789",
    licenseExpiryDate: "2025-12-31",
    status: "active",
    assignedVehicleId: "1",
    hireDate: "2022-01-15",
    createdAt: "2022-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Fatma Trabelsi",
    email: "fatma.trabelsi@fleet.tn",
    phone: "+216 98 765 432",
    licenseNumber: "DL987654321",
    licenseExpiryDate: "2026-06-15",
    status: "active",
    assignedVehicleId: "2",
    hireDate: "2021-03-20",
    createdAt: "2021-03-20T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Ahmed Karray",
    email: "ahmed.karray@fleet.tn",
    phone: "+216 55 444 333",
    licenseNumber: "DL555444333",
    licenseExpiryDate: "2024-03-10",
    status: "suspended",
    assignedVehicleId: "3",
    hireDate: "2023-06-01",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "4",
    name: "Salma Gharbi",
    email: "salma.gharbi@fleet.tn",
    phone: "+216 26 777 888",
    licenseNumber: "DL666777888",
    licenseExpiryDate: "2025-08-20",
    status: "active",
    assignedVehicleId: "4",
    hireDate: "2022-08-10",
    createdAt: "2022-08-10T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "5",
    name: "Karim Mansouri",
    email: "karim.mansouri@fleet.tn",
    phone: "+216 92 223 344",
    licenseNumber: "DL222333444",
    licenseExpiryDate: "2026-01-15",
    status: "active",
    assignedVehicleId: "5",
    hireDate: "2020-11-05",
    createdAt: "2020-11-05T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "6",
    name: "Leila Hamdi",
    email: "leila.hamdi@fleet.tn",
    phone: "+216 99 887 766",
    licenseNumber: "DL999888777",
    licenseExpiryDate: "2024-05-30",
    status: "inactive",
    hireDate: "2023-09-15",
    createdAt: "2023-09-15T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
];

// Données de maintenance (sans les vidanges)
export const mockMaintenances: Maintenance[] = [
  {
    id: "1",
    vehicleId: "2",
    type: "brake_service",
    description: "Service du système de freinage",
    scheduledDate: "2024-02-10",
    completedDate: "2024-02-10",
    status: "completed",
    cost: 350,
    mileage: 125000,
    notes: "Changement des plaquettes et disques avant",
    technician: "Atelier Mécanique Central",
    serviceCenter: "Garage Central - Tunis",
    parts: [
      {
        id: "1",
        name: "Plaquettes de frein avant",
        partNumber: "BF001",
        quantity: 2,
        unitPrice: 45.0,
        supplier: "Bosch",
      },
      {
        id: "2",
        name: "Disques de frein avant",
        partNumber: "BD001",
        quantity: 2,
        unitPrice: 85.0,
        supplier: "Brembo",
      },
    ],
    laborHours: 2.5,
    priority: "high",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "3",
    type: "inspection",
    description: "Contrôle technique annuel",
    scheduledDate: "2024-03-01",
    completedDate: undefined,
    status: "scheduled",
    cost: 85,
    mileage: 25000,
    notes: "Inspection obligatoire",
    technician: "Station de contrôle",
    serviceCenter: "Station de Contrôle - Sfax",
    priority: "medium",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "1",
    type: "routine",
    description: "Maintenance préventive générale",
    scheduledDate: "2024-02-20",
    completedDate: undefined,
    status: "in_progress",
    cost: 200,
    mileage: 46000,
    notes: "Vérification générale des systèmes",
    technician: "Atelier Mécanique Central",
    serviceCenter: "Garage Central - Tunis",
    parts: [
      {
        id: "3",
        name: "Filtre à air",
        partNumber: "AF001",
        quantity: 1,
        unitPrice: 25.0,
        supplier: "Mann",
      },
      {
        id: "4",
        name: "Filtre d'habitacle",
        partNumber: "CF001",
        quantity: 1,
        unitPrice: 18.5,
        supplier: "Bosch",
      },
    ],
    laborHours: 1.5,
    priority: "medium",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "5",
    type: "engine_service",
    description: "Service moteur et climatisation",
    scheduledDate: "2024-01-30",
    completedDate: "2024-01-30",
    status: "completed",
    cost: 280,
    mileage: 180000,
    notes: "Recharge gaz et réparation compresseur",
    technician: "Clim Auto",
    serviceCenter: "Clim Auto - Sousse",
    parts: [
      {
        id: "5",
        name: "Gaz réfrigérant R134a",
        partNumber: "AC001",
        quantity: 1,
        unitPrice: 45.0,
        supplier: "Dupont",
      },
      {
        id: "6",
        name: "Compresseur climatisation",
        partNumber: "AC002",
        quantity: 1,
        unitPrice: 180.0,
        supplier: "Valeo",
      },
    ],
    laborHours: 3.0,
    priority: "high",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "5",
    vehicleId: "4",
    type: "tire_change",
    description: "Changement de pneus hiver",
    scheduledDate: "2024-02-15",
    completedDate: undefined,
    status: "scheduled",
    cost: 450,
    mileage: 38000,
    notes: "Remplacement des 4 pneus",
    technician: "Auto Pneus",
    serviceCenter: "Auto Pneus - Bizerte",
    parts: [
      {
        id: "7",
        name: "Pneu hiver 205/55 R16",
        partNumber: "TW001",
        quantity: 4,
        unitPrice: 95.0,
        supplier: "Michelin",
      },
    ],
    laborHours: 2.0,
    priority: "medium",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
];

// Données de vidanges (séparées de la maintenance)
export const mockOilChanges: OilChange[] = [
  {
    id: "1",
    vehicleId: "1",
    scheduledDate: "2024-02-15",
    completedDate: undefined,
    status: "scheduled",
    cost: 120,
    mileage: 45000,
    oilType: "synthetic",
    oilQuantity: 5.5,
    oilBrand: "Total",
    filterChanged: true,
    filterBrand: "Mann",
    notes: "Vidange standard tous les 15 000 km",
    technician: "Atelier Mécanique Central",
    serviceCenter: "Garage Central - Tunis",
    nextOilChangeMileage: 60000,
    nextOilChangeDate: "2024-05-15",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "2",
    scheduledDate: "2024-02-10",
    completedDate: "2024-02-10",
    status: "completed",
    cost: 95,
    mileage: 125000,
    oilType: "diesel",
    oilQuantity: 8.0,
    oilBrand: "Shell",
    filterChanged: true,
    filterBrand: "Bosch",
    notes: "Vidange moteur diesel",
    technician: "Atelier Mécanique Central",
    serviceCenter: "Garage Central - Tunis",
    nextOilChangeMileage: 135000,
    nextOilChangeDate: "2024-05-10",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "3",
    scheduledDate: "2024-02-25",
    completedDate: undefined,
    status: "scheduled",
    cost: 85,
    mileage: 25000,
    oilType: "semi_synthetic",
    oilQuantity: 4.2,
    oilBrand: "Castrol",
    filterChanged: true,
    filterBrand: "Fram",
    notes: "Vidange préventive",
    technician: "Garage Express",
    serviceCenter: "Garage Express - Sfax",
    nextOilChangeMileage: 37000,
    nextOilChangeDate: "2024-05-25",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "4",
    scheduledDate: "2024-01-30",
    completedDate: "2024-01-30",
    status: "completed",
    cost: 110,
    mileage: 38000,
    oilType: "synthetic",
    oilQuantity: 6.0,
    oilBrand: "Mobil",
    filterChanged: true,
    filterBrand: "Mann",
    notes: "Vidange complète avec filtre",
    technician: "Auto Service",
    serviceCenter: "Auto Service - Bizerte",
    nextOilChangeMileage: 53000,
    nextOilChangeDate: "2024-04-30",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "5",
    vehicleId: "5",
    scheduledDate: "2024-02-28",
    completedDate: undefined,
    status: "scheduled",
    cost: 150,
    mileage: 180000,
    oilType: "diesel",
    oilQuantity: 10.0,
    oilBrand: "Total",
    filterChanged: true,
    filterBrand: "Bosch",
    notes: "Vidange moteur diesel poids lourd",
    technician: "Garage Poids Lourd",
    serviceCenter: "Garage Poids Lourd - Sousse",
    nextOilChangeMileage: 190000,
    nextOilChangeDate: "2024-05-28",
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
];

// Données de visites techniques
export const mockTechnicalInspections: TechnicalInspection[] = [
  {
    id: "1",
    vehicleId: "1",
    inspectionType: "periodic",
    inspectionDate: "2024-01-15",
    expiryDate: "2026-01-15",
    result: "favorable",
    mileage: 45000,
    cost: 85,
    inspectorName: "Mohamed Ben Ali",
    inspectionCenter: "Centre de Contrôle Technique - Tunis",
    centerAddress: "Avenue Habib Bourguiba, Tunis 1000",
    centerPhone: "+216 71 123 456",
    responsible: "Mohamed Ben Ali",
    notes: "Véhicule en bon état général. Contrôle technique favorable.",
    nextInspectionDate: "2026-01-15",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "2",
    inspectionType: "periodic",
    inspectionDate: "2024-02-10",
    expiryDate: "2026-02-10",
    result: "favorable_with_restrictions",
    mileage: 125000,
    cost: 85,
    inspectorName: "Fatma Trabelsi",
    inspectionCenter: "Centre de Contrôle Technique - Sfax",
    centerAddress: "Avenue Majida Boulila, Sfax 3000",
    centerPhone: "+216 74 456 789",
    responsible: "Fatma Trabelsi",
    defects: [
      {
        id: "1",
        category: "lights",
        description: "Phare avant gauche défaillant",
        severity: "minor",
        rectified: true,
        rectificationDate: "2024-02-12",
        cost: 45,
      },
    ],
    notes: "Véhicule conforme après rectification du défaut d'éclairage.",
    nextInspectionDate: "2026-02-10",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "3",
    inspectionType: "periodic",
    inspectionDate: "2024-03-01",
    expiryDate: "2026-03-01",
    result: "unfavorable",
    mileage: 25000,
    cost: 85,
    inspectorName: "Ahmed Karray",
    inspectionCenter: "Centre de Contrôle Technique - Sousse",
    centerAddress: "Avenue Léopold Sédar Senghor, Sousse 4000",
    centerPhone: "+216 73 789 123",
    responsible: "Ahmed Karray",
    defects: [
      {
        id: "2",
        category: "braking_system",
        description: "Efficacité de freinage insuffisante",
        severity: "critical",
        rectified: false,
      },
      {
        id: "3",
        category: "tires",
        description: "Usure excessive des pneus avant",
        severity: "major",
        rectified: false,
      },
    ],
    notes:
      "Véhicule non conforme. Réparations nécessaires avant remise en circulation.",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "4",
    inspectionType: "additional",
    inspectionDate: "2024-01-30",
    expiryDate: "2025-01-30",
    result: "favorable",
    mileage: 38000,
    cost: 85,
    inspectorName: "Salma Gharbi",
    inspectionCenter: "Centre de Contrôle Technique - Bizerte",
    centerAddress: "Avenue de la Corniche, Bizerte 7000",
    centerPhone: "+216 72 321 654",
    responsible: "Salma Gharbi",
    notes:
      "Contrôle technique complémentaire suite à réparation. Véhicule conforme.",
    nextInspectionDate: "2026-01-30",
    createdAt: "2024-01-30T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "5",
    vehicleId: "5",
    inspectionType: "pre_sale",
    inspectionDate: "2024-02-28",
    expiryDate: "2025-02-28",
    result: "favorable",
    mileage: 180000,
    cost: 85,
    inspectorName: "Karim Mansouri",
    inspectionCenter: "Centre de Contrôle Technique - Nabeul",
    centerAddress: "Avenue Farhat Hached, Nabeul 8000",
    centerPhone: "+216 72 654 987",
    responsible: "Karim Mansouri",
    notes: "Contrôle technique avant vente. Véhicule en bon état.",
    createdAt: "2024-02-28T00:00:00Z",
    updatedAt: "2024-02-28T00:00:00Z",
  },
];

// Données de consommation de carburant
export const mockFuelRecords: FuelConsumption[] = [
  {
    id: "1",
    vehicleId: "1",
    date: "2024-02-01",
    fuelType: "diesel",
    quantity: 60,
    cost: 85.2,
    mileage: 45200,
    fuelCardNumber: "FC001",
    station: "Station Total - Autoroute A1 Tunis-Sfax",
    notes: "Plein avant départ longue distance",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "2",
    date: "2024-01-28",
    fuelType: "diesel",
    quantity: 80,
    cost: 113.6,
    mileage: 124800,
    fuelCardNumber: "FC002",
    station: "Station Shell - Port de Radès",
    notes: "Ravitaillement portuaire",
    createdAt: "2024-01-28T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "3",
    date: "2024-01-25",
    fuelType: "gasoline",
    quantity: 45,
    cost: 67.5,
    mileage: 24800,
    fuelCardNumber: "FC003",
    station: "Station Agil - Centre-ville Tunis",
    notes: "Plein urbain",
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "1",
    date: "2024-01-20",
    fuelType: "diesel",
    quantity: 55,
    cost: 78.1,
    mileage: 44800,
    fuelCardNumber: "FC001",
    station: "Station Esso - Périphérique Tunis",
    notes: "Plein de retour",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "5",
    vehicleId: "4",
    date: "2024-01-18",
    fuelType: "diesel",
    quantity: 65,
    cost: 92.3,
    mileage: 37900,
    fuelCardNumber: "FC004",
    station: "Station Total - Zone Industrielle Bizerte",
    notes: "Plein avant livraison",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "6",
    vehicleId: "5",
    date: "2024-01-15",
    fuelType: "diesel",
    quantity: 100,
    cost: 142.0,
    mileage: 179800,
    fuelCardNumber: "FC005",
    station: "Station Shell - Autoroute Tunis-Sousse",
    notes: "Plein long trajet",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

// Fonction pour calculer dynamiquement les statistiques du dashboard
export const generateDashboardStats = (): DashboardStats => {
  // Compter les véhicules par statut
  const totalVehicles = mockVehicles.length;
  const activeVehicles = mockVehicles.filter(
    (v) => v.status === "active"
  ).length;
  const maintenanceVehicles = mockVehicles.filter(
    (v) => v.status === "maintenance"
  ).length;

  // Compter les chauffeurs par statut
  const totalDrivers = mockDrivers.length;
  const activeDrivers = mockDrivers.filter((d) => d.status === "active").length;

  // Statistiques de maintenance (maintenances + vidanges)
  const allMaintenances = [...mockMaintenances, ...mockOilChanges];
  const upcomingMaintenance = allMaintenances.filter(
    (m) => m.status === "scheduled" || m.status === "in_progress"
  ).length;

  // Statistiques de carburant
  const monthlyFuelCost = mockFuelRecords.reduce((sum, f) => sum + f.cost, 0);
  const totalKm = mockVehicles.reduce((sum, v) => sum + v.mileage, 0);
  const totalFuel = mockFuelRecords.reduce((sum, f) => sum + f.quantity, 0);
  const averageFuelConsumption = totalKm > 0 ? (totalFuel / totalKm) * 100 : 0;

  // Répartition des véhicules par type
  const vehiclesByType = {
    truck: mockVehicles.filter((v) => v.type === "truck").length,
    car: mockVehicles.filter((v) => v.type === "car").length,
    van: mockVehicles.filter((v) => v.type === "van").length,
  };

  // Répartition des maintenances par type
  const maintenanceByType = {
    routine: mockMaintenances.filter((m) => m.type === "routine").length,
    repair: mockMaintenances.filter((m) => m.type === "repair").length,
    inspection: mockTechnicalInspections.length,
    tire_change: mockMaintenances.filter((m) => m.type === "tire_change")
      .length,
    engine_service: mockMaintenances.filter((m) => m.type === "engine_service")
      .length,
    brake_service: mockMaintenances.filter((m) => m.type === "brake_service")
      .length,
    transmission_service: mockMaintenances.filter(
      (m) => m.type === "transmission_service"
    ).length,
    electrical_service: mockMaintenances.filter(
      (m) => m.type === "electrical_service"
    ).length,
    air_conditioning_service: mockMaintenances.filter(
      (m) => m.type === "air_conditioning_service"
    ).length,
    exhaust_service: mockMaintenances.filter(
      (m) => m.type === "exhaust_service"
    ).length,
  };

  return {
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    totalDrivers,
    activeDrivers,
    upcomingMaintenance,
    monthlyFuelCost: Math.round(monthlyFuelCost * 100) / 100,
    averageFuelConsumption: Math.round(averageFuelConsumption * 10) / 10,
    vehiclesByType,
    maintenanceByType,
  };
};

// Statistiques du dashboard calculées dynamiquement
export const mockDashboardStats: DashboardStats = generateDashboardStats();

// Fonction pour générer dynamiquement les événements du calendrier
export const generateCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Ajouter les maintenances
  mockMaintenances.forEach((maintenance) => {
    const vehicle = mockVehicles.find((v) => v.id === maintenance.vehicleId);
    const vehicleName = vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : "Véhicule";

    const startDate = new Date(maintenance.scheduledDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2);

    events.push({
      id: `maintenance-${maintenance.id}`,
      title: `Maintenance - ${vehicleName}`,
      start: startDate,
      end: endDate,
      type: "maintenance",
      vehicleId: maintenance.vehicleId,
      description: maintenance.description || "Maintenance générale",
      status:
        maintenance.status === "in_progress" ? "scheduled" : maintenance.status,
    });
  });

  // Ajouter les vidanges
  mockOilChanges.forEach((oilChange) => {
    const vehicle = mockVehicles.find((v) => v.id === oilChange.vehicleId);
    const vehicleName = vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : "Véhicule";

    const startDate = new Date(oilChange.scheduledDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    events.push({
      id: `oilchange-${oilChange.id}`,
      title: `Vidange - ${vehicleName}`,
      start: startDate,
      end: endDate,
      type: "maintenance",
      vehicleId: oilChange.vehicleId,
      description: `Vidange d'huile - ${oilChange.oilType}`,
      status:
        oilChange.status === "in_progress" ? "scheduled" : oilChange.status,
    });
  });

  // Ajouter les visites techniques
  mockTechnicalInspections.forEach((inspection) => {
    const vehicle = mockVehicles.find((v) => v.id === inspection.vehicleId);
    const vehicleName = vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : "Véhicule";

    const startDate = new Date(inspection.inspectionDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    events.push({
      id: `inspection-${inspection.id}`,
      title: `Visite Technique - ${vehicleName}`,
      start: startDate,
      end: endDate,
      type: "inspection",
      vehicleId: inspection.vehicleId,
      description: `Contrôle technique - ${inspection.inspectionCenter}`,
      status: "completed",
    });

    // Ajouter la prochaine visite technique si elle existe
    if (inspection.nextInspectionDate) {
      const nextStartDate = new Date(inspection.nextInspectionDate);
      const nextEndDate = new Date(nextStartDate);
      nextEndDate.setHours(nextStartDate.getHours() + 1);

      events.push({
        id: `inspection-next-${inspection.id}`,
        title: `Prochaine Visite Technique - ${vehicleName}`,
        start: nextStartDate,
        end: nextEndDate,
        type: "inspection",
        vehicleId: inspection.vehicleId,
        description: `Contrôle technique prévu - ${inspection.inspectionCenter}`,
        status: "scheduled",
      });
    }
  });

  return events;
};

// Événements du calendrier générés dynamiquement
export const mockCalendarEvents: CalendarEvent[] = generateCalendarEvents();
