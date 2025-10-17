/**
 * Service de données - Couche d'abstraction pour faciliter l'intégration backend
 *
 * Ce fichier définit toutes les fonctions de récupération de données.
 * Pour connecter au backend, il suffit de remplacer les imports mock par des appels API.
 *
 * Exemple de migration vers backend:
 * - Remplacer: return mockVehicles;
 * - Par: return await apiClient.get('/api/vehicles');
 */

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

// Imports mock - À remplacer par des appels API en production
import {
  mockVehicles,
  mockDrivers,
  mockMaintenances,
  mockOilChanges,
  mockTechnicalInspections,
  mockFuelRecords,
  generateDashboardStats,
  generateCalendarEvents,
} from "../data/mockData";

// ============================================================================
// VÉHICULES
// ============================================================================

export const vehicleService = {
  /**
   * Récupérer tous les véhicules
   * Backend: GET /api/vehicles
   */
  getAll: async (): Promise<Vehicle[]> => {
    // En production: return await apiClient.get('/api/vehicles');
    return Promise.resolve(mockVehicles);
  },

  /**
   * Récupérer un véhicule par ID
   * Backend: GET /api/vehicles/:id
   */
  getById: async (id: string): Promise<Vehicle | null> => {
    // En production: return await apiClient.get(`/api/vehicles/${id}`);
    const vehicle = mockVehicles.find((v) => v.id === id);
    return Promise.resolve(vehicle || null);
  },

  /**
   * Créer un nouveau véhicule
   * Backend: POST /api/vehicles
   */
  create: async (vehicle: Omit<Vehicle, "id">): Promise<Vehicle> => {
    // En production: return await apiClient.post('/api/vehicles', vehicle);
    const newVehicle = { ...vehicle, id: Date.now().toString() };
    return Promise.resolve(newVehicle);
  },

  /**
   * Mettre à jour un véhicule
   * Backend: PUT /api/vehicles/:id
   */
  update: async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    // En production: return await apiClient.put(`/api/vehicles/${id}`, vehicle);
    const existingVehicle = mockVehicles.find((v) => v.id === id);
    const updatedVehicle = { ...existingVehicle, ...vehicle } as Vehicle;
    return Promise.resolve(updatedVehicle);
  },

  /**
   * Supprimer un véhicule
   * Backend: DELETE /api/vehicles/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/vehicles/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// CHAUFFEURS
// ============================================================================

export const driverService = {
  /**
   * Récupérer tous les chauffeurs
   * Backend: GET /api/drivers
   */
  getAll: async (): Promise<Driver[]> => {
    // En production: return await apiClient.get('/api/drivers');
    return Promise.resolve(mockDrivers);
  },

  /**
   * Récupérer un chauffeur par ID
   * Backend: GET /api/drivers/:id
   */
  getById: async (id: string): Promise<Driver | null> => {
    // En production: return await apiClient.get(`/api/drivers/${id}`);
    const driver = mockDrivers.find((d) => d.id === id);
    return Promise.resolve(driver || null);
  },

  /**
   * Créer un nouveau chauffeur
   * Backend: POST /api/drivers
   */
  create: async (driver: Omit<Driver, "id">): Promise<Driver> => {
    // En production: return await apiClient.post('/api/drivers', driver);
    const newDriver = { ...driver, id: Date.now().toString() };
    return Promise.resolve(newDriver);
  },

  /**
   * Mettre à jour un chauffeur
   * Backend: PUT /api/drivers/:id
   */
  update: async (id: string, driver: Partial<Driver>): Promise<Driver> => {
    // En production: return await apiClient.put(`/api/drivers/${id}`, driver);
    const existingDriver = mockDrivers.find((d) => d.id === id);
    const updatedDriver = { ...existingDriver, ...driver } as Driver;
    return Promise.resolve(updatedDriver);
  },

  /**
   * Supprimer un chauffeur
   * Backend: DELETE /api/drivers/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/drivers/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// MAINTENANCE
// ============================================================================

export const maintenanceService = {
  /**
   * Récupérer toutes les maintenances
   * Backend: GET /api/maintenances
   */
  getAll: async (): Promise<Maintenance[]> => {
    // En production: return await apiClient.get('/api/maintenances');
    return Promise.resolve(mockMaintenances);
  },

  /**
   * Récupérer une maintenance par ID
   * Backend: GET /api/maintenances/:id
   */
  getById: async (id: string): Promise<Maintenance | null> => {
    // En production: return await apiClient.get(`/api/maintenances/${id}`);
    const maintenance = mockMaintenances.find((m) => m.id === id);
    return Promise.resolve(maintenance || null);
  },

  /**
   * Récupérer les maintenances d'un véhicule
   * Backend: GET /api/vehicles/:vehicleId/maintenances
   */
  getByVehicle: async (vehicleId: string): Promise<Maintenance[]> => {
    // En production: return await apiClient.get(`/api/vehicles/${vehicleId}/maintenances`);
    const maintenances = mockMaintenances.filter(
      (m) => m.vehicleId === vehicleId
    );
    return Promise.resolve(maintenances);
  },

  /**
   * Créer une nouvelle maintenance
   * Backend: POST /api/maintenances
   */
  create: async (
    maintenance: Omit<Maintenance, "id">
  ): Promise<Maintenance> => {
    // En production: return await apiClient.post('/api/maintenances', maintenance);
    const newMaintenance = { ...maintenance, id: Date.now().toString() };
    return Promise.resolve(newMaintenance);
  },

  /**
   * Mettre à jour une maintenance
   * Backend: PUT /api/maintenances/:id
   */
  update: async (
    id: string,
    maintenance: Partial<Maintenance>
  ): Promise<Maintenance> => {
    // En production: return await apiClient.put(`/api/maintenances/${id}`, maintenance);
    const existingMaintenance = mockMaintenances.find((m) => m.id === id);
    const updatedMaintenance = {
      ...existingMaintenance,
      ...maintenance,
    } as Maintenance;
    return Promise.resolve(updatedMaintenance);
  },

  /**
   * Supprimer une maintenance
   * Backend: DELETE /api/maintenances/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/maintenances/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// VIDANGES
// ============================================================================

export const oilChangeService = {
  /**
   * Récupérer toutes les vidanges
   * Backend: GET /api/oil-changes
   */
  getAll: async (): Promise<OilChange[]> => {
    // En production: return await apiClient.get('/api/oil-changes');
    return Promise.resolve(mockOilChanges);
  },

  /**
   * Récupérer une vidange par ID
   * Backend: GET /api/oil-changes/:id
   */
  getById: async (id: string): Promise<OilChange | null> => {
    // En production: return await apiClient.get(`/api/oil-changes/${id}`);
    const oilChange = mockOilChanges.find((o) => o.id === id);
    return Promise.resolve(oilChange || null);
  },

  /**
   * Récupérer les vidanges d'un véhicule
   * Backend: GET /api/vehicles/:vehicleId/oil-changes
   */
  getByVehicle: async (vehicleId: string): Promise<OilChange[]> => {
    // En production: return await apiClient.get(`/api/vehicles/${vehicleId}/oil-changes`);
    const oilChanges = mockOilChanges.filter((o) => o.vehicleId === vehicleId);
    return Promise.resolve(oilChanges);
  },

  /**
   * Créer une nouvelle vidange
   * Backend: POST /api/oil-changes
   */
  create: async (oilChange: Omit<OilChange, "id">): Promise<OilChange> => {
    // En production: return await apiClient.post('/api/oil-changes', oilChange);
    const newOilChange = { ...oilChange, id: Date.now().toString() };
    return Promise.resolve(newOilChange);
  },

  /**
   * Mettre à jour une vidange
   * Backend: PUT /api/oil-changes/:id
   */
  update: async (
    id: string,
    oilChange: Partial<OilChange>
  ): Promise<OilChange> => {
    // En production: return await apiClient.put(`/api/oil-changes/${id}`, oilChange);
    const existingOilChange = mockOilChanges.find((o) => o.id === id);
    const updatedOilChange = {
      ...existingOilChange,
      ...oilChange,
    } as OilChange;
    return Promise.resolve(updatedOilChange);
  },

  /**
   * Supprimer une vidange
   * Backend: DELETE /api/oil-changes/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/oil-changes/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// VISITES TECHNIQUES
// ============================================================================

export const technicalInspectionService = {
  /**
   * Récupérer toutes les visites techniques
   * Backend: GET /api/technical-inspections
   */
  getAll: async (): Promise<TechnicalInspection[]> => {
    // En production: return await apiClient.get('/api/technical-inspections');
    return Promise.resolve(mockTechnicalInspections);
  },

  /**
   * Récupérer une visite technique par ID
   * Backend: GET /api/technical-inspections/:id
   */
  getById: async (id: string): Promise<TechnicalInspection | null> => {
    // En production: return await apiClient.get(`/api/technical-inspections/${id}`);
    const inspection = mockTechnicalInspections.find((i) => i.id === id);
    return Promise.resolve(inspection || null);
  },

  /**
   * Récupérer les visites techniques d'un véhicule
   * Backend: GET /api/vehicles/:vehicleId/technical-inspections
   */
  getByVehicle: async (vehicleId: string): Promise<TechnicalInspection[]> => {
    // En production: return await apiClient.get(`/api/vehicles/${vehicleId}/technical-inspections`);
    const inspections = mockTechnicalInspections.filter(
      (i) => i.vehicleId === vehicleId
    );
    return Promise.resolve(inspections);
  },

  /**
   * Créer une nouvelle visite technique
   * Backend: POST /api/technical-inspections
   */
  create: async (
    inspection: Omit<TechnicalInspection, "id">
  ): Promise<TechnicalInspection> => {
    // En production: return await apiClient.post('/api/technical-inspections', inspection);
    const newInspection = { ...inspection, id: Date.now().toString() };
    return Promise.resolve(newInspection);
  },

  /**
   * Mettre à jour une visite technique
   * Backend: PUT /api/technical-inspections/:id
   */
  update: async (
    id: string,
    inspection: Partial<TechnicalInspection>
  ): Promise<TechnicalInspection> => {
    // En production: return await apiClient.put(`/api/technical-inspections/${id}`, inspection);
    const existingInspection = mockTechnicalInspections.find(
      (i) => i.id === id
    );
    const updatedInspection = {
      ...existingInspection,
      ...inspection,
    } as TechnicalInspection;
    return Promise.resolve(updatedInspection);
  },

  /**
   * Supprimer une visite technique
   * Backend: DELETE /api/technical-inspections/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/technical-inspections/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// CARBURANT
// ============================================================================

export const fuelService = {
  /**
   * Récupérer tous les enregistrements de carburant
   * Backend: GET /api/fuel-records
   */
  getAll: async (): Promise<FuelConsumption[]> => {
    // En production: return await apiClient.get('/api/fuel-records');
    return Promise.resolve(mockFuelRecords);
  },

  /**
   * Récupérer un enregistrement de carburant par ID
   * Backend: GET /api/fuel-records/:id
   */
  getById: async (id: string): Promise<FuelConsumption | null> => {
    // En production: return await apiClient.get(`/api/fuel-records/${id}`);
    const fuelRecord = mockFuelRecords.find((f) => f.id === id);
    return Promise.resolve(fuelRecord || null);
  },

  /**
   * Récupérer les enregistrements de carburant d'un véhicule
   * Backend: GET /api/vehicles/:vehicleId/fuel-records
   */
  getByVehicle: async (vehicleId: string): Promise<FuelConsumption[]> => {
    // En production: return await apiClient.get(`/api/vehicles/${vehicleId}/fuel-records`);
    const fuelRecords = mockFuelRecords.filter(
      (f) => f.vehicleId === vehicleId
    );
    return Promise.resolve(fuelRecords);
  },

  /**
   * Créer un nouvel enregistrement de carburant
   * Backend: POST /api/fuel-records
   */
  create: async (
    fuelRecord: Omit<FuelConsumption, "id">
  ): Promise<FuelConsumption> => {
    // En production: return await apiClient.post('/api/fuel-records', fuelRecord);
    const newFuelRecord = { ...fuelRecord, id: Date.now().toString() };
    return Promise.resolve(newFuelRecord);
  },

  /**
   * Mettre à jour un enregistrement de carburant
   * Backend: PUT /api/fuel-records/:id
   */
  update: async (
    id: string,
    fuelRecord: Partial<FuelConsumption>
  ): Promise<FuelConsumption> => {
    // En production: return await apiClient.put(`/api/fuel-records/${id}`, fuelRecord);
    const existingFuelRecord = mockFuelRecords.find((f) => f.id === id);
    const updatedFuelRecord = {
      ...existingFuelRecord,
      ...fuelRecord,
    } as FuelConsumption;
    return Promise.resolve(updatedFuelRecord);
  },

  /**
   * Supprimer un enregistrement de carburant
   * Backend: DELETE /api/fuel-records/:id
   */
  delete: async (_id: string): Promise<void> => {
    // En production: return await apiClient.delete(`/api/fuel-records/${id}`);
    return Promise.resolve();
  },
};

// ============================================================================
// DASHBOARD & STATISTIQUES
// ============================================================================

export const dashboardService = {
  /**
   * Récupérer les statistiques du dashboard
   * Backend: GET /api/dashboard/stats
   */
  getStats: async (): Promise<DashboardStats> => {
    // En production: return await apiClient.get('/api/dashboard/stats');
    // Les stats sont recalculées dynamiquement à chaque appel
    return Promise.resolve(generateDashboardStats());
  },

  /**
   * Récupérer les événements du calendrier
   * Backend: GET /api/calendar/events
   */
  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    // En production: return await apiClient.get('/api/calendar/events');
    // Les événements sont générés dynamiquement à partir des données
    return Promise.resolve(generateCalendarEvents());
  },
};

// ============================================================================
// EXPORT PAR DÉFAUT - Pour faciliter l'utilisation
// ============================================================================

const dataService = {
  vehicles: vehicleService,
  drivers: driverService,
  maintenances: maintenanceService,
  oilChanges: oilChangeService,
  technicalInspections: technicalInspectionService,
  fuel: fuelService,
  dashboard: dashboardService,
};

export default dataService;
