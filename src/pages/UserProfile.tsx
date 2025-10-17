import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Données du formulaire d'informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  // Données du formulaire de changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [personalInfoErrors, setPersonalInfoErrors] = useState<
    Partial<Record<keyof typeof personalInfo, string>>
  >({});

  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof typeof passwordData, string>>
  >({});

  const validatePersonalInfo = (): boolean => {
    const errors: Partial<Record<keyof typeof personalInfo, string>> = {};

    if (!personalInfo.name.trim()) {
      errors.name = "Le nom est requis";
    }

    if (!personalInfo.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.email = "Email invalide";
    }

    if (personalInfo.phone && !/^[0-9\s\-+()]{8,}$/.test(personalInfo.phone)) {
      errors.phone = "Numéro de téléphone invalide";
    }

    setPersonalInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (): boolean => {
    const errors: Partial<Record<keyof typeof passwordData, string>> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Le mot de passe actuel est requis";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword =
        "Le nouveau mot de passe doit être différent de l'ancien";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validatePersonalInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Remplacer par un appel API réel
      console.log("Mise à jour des informations personnelles:", personalInfo);

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Actualiser les informations de l'utilisateur
      await refreshUser();

      setSuccessMessage("Informations personnelles mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setErrorMessage(
        "Une erreur est survenue lors de la mise à jour des informations"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Remplacer par un appel API réel
      console.log("Changement de mot de passe");

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Mot de passe modifié avec succès");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setErrorMessage(
        "Une erreur est survenue lors du changement de mot de passe"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur du champ modifié
    if (personalInfoErrors[name as keyof typeof personalInfo]) {
      setPersonalInfoErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur du champ modifié
    if (passwordErrors[name as keyof typeof passwordData]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="mr-3 h-8 w-8 text-blue-600" />
            Mon Profil
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos informations personnelles et paramètres de sécurité
          </p>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h2>

            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  <User className="inline h-4 w-4 mr-2" />
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    personalInfoErrors.name
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {personalInfoErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {personalInfoErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    personalInfoErrors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {personalInfoErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {personalInfoErrors.email}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Phone className="inline h-4 w-4 mr-2" />
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  placeholder="+216 XX XXX XXX"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    personalInfoErrors.phone
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {personalInfoErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {personalInfoErrors.phone}
                  </p>
                )}
              </div>

              {/* Rôle (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <input
                  type="text"
                  value={user?.role || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contactez un administrateur pour modifier votre rôle
                </p>
              </div>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>

          {/* Changement de mot de passe */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sécurité
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Mot de passe actuel */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Lock className="inline h-4 w-4 mr-2" />
                  Mot de passe actuel <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                      passwordErrors.currentPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                      passwordErrors.newPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.newPassword}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>

              {/* Confirmation du mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmer le mot de passe{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                      passwordErrors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Modification..." : "Changer le mot de passe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
