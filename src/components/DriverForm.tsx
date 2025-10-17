import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Users } from "lucide-react";
import type { DriverFormData } from "../types";

interface DriverFormProps {
  initialData?: Partial<DriverFormData>;
  isEdit?: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DriverFormData>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    status: "active",
    assignedVehicleId: "",
    hireDate: new Date().toISOString().split("T")[0],
    ...initialData,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // En production, remplacer par l'appel API réel
      // if (isEdit) {
      //   await driverService.update(driverId, formData);
      // } else {
      //   await driverService.create(formData);
      // }

      console.log("Données du chauffeur:", formData);
      navigate("/drivers");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? "Modifier le chauffeur" : "Nouveau chauffeur"}
              </h2>
            </div>
            <button
              onClick={() => navigate("/drivers")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="jean.dupont@fleet.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="01 23 45 67 89"
              />
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Numéro de permis *
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="DL123456789"
              />
            </div>

            <div>
              <label
                htmlFor="licenseExpiryDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date d'expiration du permis *
              </label>
              <input
                type="date"
                id="licenseExpiryDate"
                name="licenseExpiryDate"
                required
                value={formData.licenseExpiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="hireDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date d'embauche *
              </label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                required
                value={formData.hireDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="assignedVehicleId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Véhicule assigné
              </label>
              <select
                id="assignedVehicleId"
                name="assignedVehicleId"
                value={formData.assignedVehicleId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Aucun véhicule assigné</option>
                <option value="1">AB-123-CD - Mercedes Sprinter</option>
                <option value="2">EF-456-GH - Volvo FH16</option>
                <option value="3">IJ-789-KL - Toyota Camry</option>
                <option value="4">MN-012-OP - Ford Transit</option>
                <option value="5">QR-345-ST - Scania R450</option>
                <option value="6">UV-678-WX - BMW X5</option>
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/drivers")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? "Sauvegarde..." : isEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
