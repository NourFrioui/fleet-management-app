// Configuration centralisée pour l'API
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",

  // Timeout par défaut pour les requêtes
  TIMEOUT: 10000,

  // Configuration des endpoints
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
    },

    // Véhicules
    VEHICLES: {
      BASE: "/vehicles",
      BY_ID: (id: string) => `/vehicles/${id}`,
      ASSIGN_DRIVER: (id: string) => `/vehicles/${id}/assign-driver`,
    },

    // Chauffeurs
    DRIVERS: {
      BASE: "/drivers",
      BY_ID: (id: string) => `/drivers/${id}`,
    },

    // Maintenance
    MAINTENANCE: {
      BASE: "/maintenance",
      BY_ID: (id: string) => `/maintenance/${id}`,
      COMPLETE: (id: string) => `/maintenance/${id}/complete`,
    },

    // Carburant
    FUEL: {
      BASE: "/fuel",
      BY_ID: (id: string) => `/fuel/${id}`,
    },

    // Assurances
    INSURANCE: {
      BASE: "/insurance",
      BY_ID: (id: string) => `/insurance/${id}`,
    },

    // Cartes essence
    FUEL_CARDS: {
      BASE: "/fuel-cards",
      BY_ID: (id: string) => `/fuel-cards/${id}`,
    },

    // Dashboard
    DASHBOARD: {
      STATS: "/dashboard/stats",
      CALENDAR_EVENTS: "/calendar/events",
    },

    // Rapports
    REPORTS: {
      BASE: "/reports",
      GENERATE: "/reports/generate",
      DOWNLOAD: (id: string) => `/reports/${id}/download`,
    },
  },

  // Configuration des headers par défaut
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Configuration de la pagination par défaut
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Configuration du cache
  CACHE: {
    ENABLED: true,
    TTL: 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 100,
  },

  // Configuration des retry
  RETRY: {
    ENABLED: true,
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 seconde
    BACKOFF_FACTOR: 2,
  },

  // Configuration des erreurs
  ERROR_HANDLING: {
    SHOW_NOTIFICATIONS: true,
    LOG_TO_CONSOLE: true,
    RETRY_ON_NETWORK_ERROR: true,
  },
};

// Types pour la configuration
export interface ApiEndpoint {
  base: string;
  endpoints: Record<string, string | ((...args: any[]) => string)>;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: PaginationConfig;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
}

// Configuration des environnements
export const ENV_CONFIG = {
  development: {
    API_URL: "http://localhost:3001/api",
    DEBUG: true,
    MOCK_DATA: true,
  },
  staging: {
    API_URL: "https://staging-api.fleetmanager.com/api",
    DEBUG: true,
    MOCK_DATA: false,
  },
  production: {
    API_URL: "https://api.fleetmanager.com/api",
    DEBUG: false,
    MOCK_DATA: false,
  },
};

// Fonction pour obtenir la configuration selon l'environnement
export const getEnvConfig = () => {
  const env = import.meta.env.MODE as keyof typeof ENV_CONFIG;
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// Configuration des codes de statut HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Messages d'erreur par défaut
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Erreur de connexion réseau. Veuillez vérifier votre connexion internet.",
  TIMEOUT_ERROR:
    "La requête a pris trop de temps à répondre. Veuillez réessayer.",
  UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette ressource.",
  FORBIDDEN: "Accès interdit. Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: "La ressource demandée n'a pas été trouvée.",
  VALIDATION_ERROR: "Les données fournies ne sont pas valides.",
  SERVER_ERROR:
    "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
  UNKNOWN_ERROR: "Une erreur inattendue est survenue.",
} as const;

// Configuration des formats de date
export const DATE_FORMATS = {
  API_DATE: "YYYY-MM-DD",
  API_DATETIME: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
  DISPLAY_TIME: "HH:mm",
} as const;

// Configuration des formats de fichier supportés
export const SUPPORTED_FILE_FORMATS = {
  IMAGES: ["jpg", "jpeg", "png", "gif", "webp"],
  DOCUMENTS: ["pdf", "doc", "docx", "xls", "xlsx"],
  EXPORTS: ["pdf", "excel", "csv"],
} as const;

// Limites de taille de fichier (en octets)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  EXPORT: 50 * 1024 * 1024, // 50MB
} as const;
