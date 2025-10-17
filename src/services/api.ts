import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type {
  User,
  LoginCredentials,
  Vehicle,
  VehicleFormData,
  Driver,
  DriverFormData,
  Maintenance,
  MaintenanceFormData,
  FuelConsumption,
  FuelConsumptionFormData,
  DashboardStats,
  CalendarEvent,
  ApiResponse,
  PaginatedResponse,
  VehicleFilters,
  MaintenanceFilters,
  FuelFilters,
} from "../types";
import { mockLogin, mockVerifyToken } from "../utils/mockAuth";

// Configuration de base d'Axios
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      // En mode développement, utiliser les données de démonstration
      const data = await mockLogin(credentials);
      return { data, success: true };
    } catch (error) {
      // En production, utiliser l'API réelle
      // const response = await api.post("/auth/login", credentials);
      // return response.data;
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    // En mode développement, juste nettoyer le localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // En production, appeler l'API
    // await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Aucun token trouvé");
      }

      // En mode développement, utiliser les données de démonstration
      const user = await mockVerifyToken(token);
      return { data: user, success: true };
    } catch (error) {
      // En production, utiliser l'API réelle
      // const response = await api.get("/auth/me");
      // return response.data;
      throw error;
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    // En mode développement, générer un nouveau token mock
    const token = "mock-jwt-token-" + Date.now();
    return { data: { token }, success: true };

    // En production, utiliser l'API réelle
    // const response = await api.post("/auth/refresh");
    // return response.data;
  },
};

// Services pour les véhicules
export const vehicleService = {
  getAll: async (
    filters?: VehicleFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Vehicle>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        )),
    });
    const response = await api.get(`/vehicles?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Vehicle>> => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data: VehicleFormData): Promise<ApiResponse<Vehicle>> => {
    const response = await api.post("/vehicles", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<VehicleFormData>
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  assignDriver: async (
    vehicleId: string,
    driverId: string
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await api.patch(`/vehicles/${vehicleId}/assign-driver`, {
      driverId,
    });
    return response.data;
  },
};

// Services pour les chauffeurs
export const driverService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Driver>> => {
    const response = await api.get(`/drivers?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Driver>> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  create: async (data: DriverFormData): Promise<ApiResponse<Driver>> => {
    const response = await api.post("/drivers", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<DriverFormData>
  ): Promise<ApiResponse<Driver>> => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },
};

// Services pour la maintenance
export const maintenanceService = {
  getAll: async (
    filters?: MaintenanceFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Maintenance>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        )),
    });
    const response = await api.get(`/maintenance?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Maintenance>> => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (
    data: MaintenanceFormData
  ): Promise<ApiResponse<Maintenance>> => {
    const response = await api.post("/maintenance", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<MaintenanceFormData>
  ): Promise<ApiResponse<Maintenance>> => {
    const response = await api.put(`/maintenance/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  },

  markCompleted: async (
    id: string,
    completedDate: string,
    notes?: string
  ): Promise<ApiResponse<Maintenance>> => {
    const response = await api.patch(`/maintenance/${id}/complete`, {
      completedDate,
      notes,
    });
    return response.data;
  },
};

// Services pour la consommation de carburant
export const fuelService = {
  getAll: async (
    filters?: FuelFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<FuelConsumption>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        )),
    });
    const response = await api.get(`/fuel?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<FuelConsumption>> => {
    const response = await api.get(`/fuel/${id}`);
    return response.data;
  },

  create: async (
    data: FuelConsumptionFormData
  ): Promise<ApiResponse<FuelConsumption>> => {
    const response = await api.post("/fuel", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<FuelConsumptionFormData>
  ): Promise<ApiResponse<FuelConsumption>> => {
    const response = await api.put(`/fuel/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/fuel/${id}`);
    return response.data;
  },
};

// Services pour le dashboard
export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getCalendarEvents: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<CalendarEvent[]>> => {
    const response = await api.get(
      `/calendar/events?start=${startDate}&end=${endDate}`
    );
    return response.data;
  },
};

export default api;
