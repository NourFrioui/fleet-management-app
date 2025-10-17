import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState, LoginCredentials } from "../types";
import { authService } from "../services/api";

// Types pour le contexte
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Actions pour le reducer
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "REFRESH_START" }
  | { type: "REFRESH_SUCCESS"; payload: User }
  | { type: "REFRESH_FAILURE" };

// État initial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer pour gérer l'état d'authentification
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "REFRESH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "REFRESH_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "REFRESH_FAILURE":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pour le provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider du contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          dispatch({ type: "REFRESH_START" });
          const response = await authService.getCurrentUser();

          if (response.success) {
            dispatch({ type: "REFRESH_SUCCESS", payload: response.data });
          } else {
            dispatch({ type: "REFRESH_FAILURE" });
          }
        } catch (error) {
          console.error(
            "Erreur lors de la vérification de l'authentification:",
            error
          );
          dispatch({ type: "REFRESH_FAILURE" });
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
      } else {
        dispatch({ type: "REFRESH_FAILURE" });
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: "LOGIN_START" });
      const response = await authService.login(credentials);

      if (response.success) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        throw new Error(response.message || "Échec de la connexion");
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    authService.logout().catch(console.error);
  };

  // Fonction pour actualiser les informations utilisateur
  const refreshUser = async (): Promise<void> => {
    try {
      dispatch({ type: "REFRESH_START" });
      const response = await authService.getCurrentUser();

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "REFRESH_SUCCESS", payload: response.data });
      } else {
        dispatch({ type: "REFRESH_FAILURE" });
      }
    } catch (error) {
      console.error("Erreur lors de l'actualisation de l'utilisateur:", error);
      dispatch({ type: "REFRESH_FAILURE" });
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

export default AuthContext;
