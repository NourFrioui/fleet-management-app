// Utilitaires pour simuler l'authentification en mode développement
import type { User, LoginCredentials } from "../types";

// Utilisateur de démonstration
export const mockUser: User = {
  id: "1",
  email: "admin@fleet.tn",
  name: "Administrateur",
  role: "admin",
};

// Fonction pour simuler la connexion
export const mockLogin = async (
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> => {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Vérification des identifiants de démonstration
  if (
    credentials.email === "admin@fleet.tn" &&
    credentials.password === "admin123"
  ) {
    const token = "mock-jwt-token-" + Date.now();
    return { user: mockUser, token };
  }

  throw new Error("Identifiants incorrects");
};

// Fonction pour simuler la vérification du token
export const mockVerifyToken = async (token: string): Promise<User> => {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (token.startsWith("mock-jwt-token-")) {
    return mockUser;
  }

  throw new Error("Token invalide");
};
