// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "operator";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Types pour les véhicules
export type VehicleType =
  | "truck"
  | "car"
  | "van"
  | "motorcycle"
  | "bus"
  | "trailer";
export type VehicleCategory =
  | "commercial"
  | "passenger"
  | "utility"
  | "emergency"
  | "construction"
  | "agricultural";

export interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  category: VehicleCategory;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "lpg";
  color: string;
  purchaseDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  assignedDriverId?: string;
  fuelCardNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  category: VehicleCategory;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "lpg";
  color: string;
  purchaseDate: string;
  assignedDriverId?: string;
  fuelCardNumber?: string;
}

// Types pour les chauffeurs
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: "active" | "inactive" | "suspended";
  assignedVehicleId?: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFormData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: "active" | "inactive" | "suspended";
  assignedVehicleId?: string;
  hireDate: string;
}

// Types pour la maintenance
export type MaintenanceType =
  | "routine"
  | "repair"
  | "inspection"
  | "tire_change"
  | "brake_service"
  | "engine_service"
  | "transmission_service"
  | "electrical_service"
  | "air_conditioning_service"
  | "exhaust_service";

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  cost?: number;
  mileage: number;
  notes?: string;
  technician?: string;
  serviceCenter?: string;
  parts?: MaintenancePart[];
  laborHours?: number;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceFormData {
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  cost?: number;
  mileage: number;
  notes?: string;
  technician?: string;
  serviceCenter?: string;
  parts?: MaintenancePart[];
  laborHours?: number;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  supplier?: string;
}

// Types pour la vidange
export type OilType =
  | "synthetic"
  | "semi_synthetic"
  | "mineral"
  | "diesel"
  | "gasoline";

export interface OilChange {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  cost?: number;
  mileage: number;
  oilType: OilType;
  oilQuantity: number;
  oilBrand?: string;
  filterChanged: boolean;
  filterBrand?: string;
  notes?: string;
  technician?: string;
  serviceCenter?: string;
  nextOilChangeMileage?: number;
  nextOilChangeDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OilChangeFormData {
  vehicleId: string;
  scheduledDate: string;
  cost?: number;
  mileage: number;
  oilType: OilType;
  oilQuantity: number;
  oilBrand?: string;
  filterChanged: boolean;
  filterBrand?: string;
  notes?: string;
  technician?: string;
  serviceCenter?: string;
  nextOilChangeMileage?: number;
  nextOilChangeDate?: string;
}

// Types pour la consommation de carburant
export interface FuelConsumption {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  date: string;
  fuelType: "gasoline" | "diesel" | "electric";
  quantity: number;
  cost: number;
  mileage: number;
  fuelCardNumber?: string;
  station?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelConsumptionFormData {
  vehicleId: string;
  date: string;
  fuelType: "gasoline" | "diesel" | "electric";
  quantity: number;
  cost: number;
  mileage: number;
  fuelCardNumber?: string;
  station?: string;
  notes?: string;
}

// Types pour les statistiques du dashboard
export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  upcomingMaintenance: number;
  monthlyFuelCost: number;
  averageFuelConsumption: number;
  vehiclesByType: {
    truck: number;
    car: number;
    van: number;
  };
  maintenanceByType: {
    routine: number;
    repair: number;
    inspection: number;
    tire_change: number;
    engine_service: number;
    brake_service: number;
    transmission_service: number;
    electrical_service: number;
    air_conditioning_service: number;
    exhaust_service: number;
  };
}

// Types pour l'API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les événements du calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "maintenance" | "fuel" | "inspection" | "insurance";
  vehicleId: string;
  vehicle?: Vehicle;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
}

// Types pour les filtres
export interface VehicleFilters {
  status?: string;
  type?: string;
  fuelType?: string;
  search?: string;
}

export interface MaintenanceFilters {
  status?: string;
  type?: string;
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: string;
}

export interface OilChangeFilters {
  status?: string;
  vehicleId?: string;
  oilType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Types pour les visites techniques
export type InspectionType =
  | "first_registration"
  | "periodic"
  | "additional"
  | "pre_sale"
  | "after_repair";

export type InspectionResult =
  | "favorable"
  | "unfavorable"
  | "favorable_with_restrictions";

export interface TechnicalInspection {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  inspectionType: InspectionType;
  inspectionDate: string;
  expiryDate: string;
  result: InspectionResult;
  mileage: number;
  cost: number;
  inspectorName: string;
  inspectionCenter: string;
  centerAddress?: string;
  centerPhone?: string;
  responsible?: string;
  defects?: InspectionDefect[];
  notes?: string;
  nextInspectionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionDefect {
  id: string;
  category: string;
  description: string;
  severity: "minor" | "major" | "critical";
  rectified: boolean;
  rectificationDate?: string;
  cost?: number;
}

export interface TechnicalInspectionFormData {
  vehicleId: string;
  inspectionType: InspectionType;
  inspectionDate: string;
  expiryDate: string;
  result: InspectionResult;
  mileage: number;
  cost: number;
  inspectorName: string;
  inspectionCenter: string;
  centerAddress?: string;
  centerPhone?: string;
  responsible?: string;
  defects?: InspectionDefect[];
  notes?: string;
  nextInspectionDate?: string;
}

export interface TechnicalInspectionFilters {
  vehicleId?: string;
  inspectionType?: string;
  result?: string;
  dateFrom?: string;
  dateTo?: string;
  center?: string;
}

export interface FuelFilters {
  vehicleId?: string;
  fuelType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Types pour l'assurance
export type InsuranceType =
  | "comprehensive"
  | "third_party"
  | "fire_theft"
  | "commercial";

export interface Insurance {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  type: InsuranceType;
  company: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number; // Prix TTC (obsolète, gardé pour compatibilité)
  premiumExcludingTax?: number; // Prix HT (hors toutes taxes)
  vatRate?: number; // Taux TVA en % (19% en Tunisie)
  vatAmount?: number; // Montant TVA
  fiscalStamp?: number; // Timbre fiscal (1 TND en Tunisie)
  otherTaxes?: number; // Autres taxes
  totalTaxAmount?: number; // Total des taxes (TVA + Timbre + Autres)
  premiumIncludingTax?: number; // Prix TTC (prix final)
  coverage: number;
  deductible: number;
  status: "active" | "expired" | "cancelled";
  agentName?: string;
  agentPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceFormData {
  vehicleId: string;
  type: InsuranceType;
  company: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number; // Prix TTC (obsolète, gardé pour compatibilité)
  premiumExcludingTax?: number; // Prix HT (hors toutes taxes)
  vatRate?: number; // Taux TVA en % (19% en Tunisie)
  vatAmount?: number; // Montant TVA
  fiscalStamp?: number; // Timbre fiscal (1 TND en Tunisie)
  otherTaxes?: number; // Autres taxes
  totalTaxAmount?: number; // Total des taxes (TVA + Timbre + Autres)
  premiumIncludingTax?: number; // Prix TTC (prix final)
  coverage: number;
  deductible: number;
  agentName?: string;
  agentPhone?: string;
  notes?: string;
}

export interface InsuranceFilters {
  vehicleId?: string;
  type?: string;
  status?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
}
