import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import type { TireChangeFormData, Vehicle, TirePosition } from "../types";

interface TireChangeFormProps {
  isEdit?: boolean;
}

const TireChangeForm: React.FC<TireChangeFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();

  // Mock vehicles
  const mockVehicles: Vehicle[] = [
    {
      id: "1",
      plateNumber: "123 TUN 4567",
      brand: "Renault",
      model: "Clio",
      year: 2020,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 48500,
      fuelType: "gasoline",
      color: "Bleu",
      purchaseDate: "2020-01-15",
      lastMaintenanceDate: "2024-02-20",
      nextMaintenanceDate: "2024-08-20",
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2024-02-20T00:00:00Z",
    },
  ];

  const [formData, setFormData] = useState<TireChangeFormData>({
    vehicleId: "",
    position: "AVD",
    tireBrand: "",
    tireModel: "",
    tireSize: "",
    mileage: 0,
    cost: 0,
    date: new Date().toISOString().split("T")[0],
    serviceCenter: "",
    technician: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "mileage" || name === "cost" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Le véhicule est requis";
    }
    if (!formData.position) {
      newErrors.position = "La position est requise";
    }
    if (!formData.tireBrand.trim()) {
      newErrors.tireBrand = "La marque du pneu est requise";
    }
    if (!formData.tireModel.trim()) {
      newErrors.tireModel = "Le modèle du pneu est requis";
    }
    if (!formData.tireSize.trim()) {
      newErrors.tireSize = "La taille du pneu est requise";
    }
    if (formData.mileage <= 0) {
      newErrors.mileage = "Le kilométrage doit être supérieur à 0";
    }
    if (formData.cost <= 0) {
      newErrors.cost = "Le coût doit être supérieur à 0";
    }
    if (!formData.date) {
      newErrors.date = "La date est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Logique de soumission ici
    console.log("Form data:", formData);

    // Rediriger vers la liste
    navigate("/tire-change");
  };

  const positions: { value: TirePosition; label: string }[] = [
    { value: "AVD", label: "Avant Droit (AVD)" },
    { value: "AVG", label: "Avant Gauche (AVG)" },
    { value: "ARD", label: "Arrière Droit (ARD)" },
    { value: "ARG", label: "Arrière Gauche (ARG)" },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/tire-change")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit
                ? "Modifier le changement de pneu"
                : "Nouveau changement de pneu"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Enregistrez les détails du changement de pneu
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* Véhicule */}
          <div>
            <label
              htmlFor="vehicleId"
              className="block text-sm font-medium text-gray-700"
            >
              Véhicule *
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.vehicleId
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              }`}
            >
              <option value="">Sélectionner un véhicule</option>
              {mockVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position du pneu *
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.position
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              >
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Marque */}
            <div>
              <label
                htmlFor="tireBrand"
                className="block text-sm font-medium text-gray-700"
              >
                Marque du pneu *
              </label>
              <input
                type="text"
                id="tireBrand"
                name="tireBrand"
                value={formData.tireBrand}
                onChange={handleInputChange}
                placeholder="Michelin, Continental, etc."
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.tireBrand
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.tireBrand && (
                <p className="mt-1 text-sm text-red-600">{errors.tireBrand}</p>
              )}
            </div>

            {/* Modèle */}
            <div>
              <label
                htmlFor="tireModel"
                className="block text-sm font-medium text-gray-700"
              >
                Modèle du pneu *
              </label>
              <input
                type="text"
                id="tireModel"
                name="tireModel"
                value={formData.tireModel}
                onChange={handleInputChange}
                placeholder="Primacy 4, etc."
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.tireModel
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.tireModel && (
                <p className="mt-1 text-sm text-red-600">{errors.tireModel}</p>
              )}
            </div>

            {/* Taille */}
            <div>
              <label
                htmlFor="tireSize"
                className="block text-sm font-medium text-gray-700"
              >
                Taille du pneu *
              </label>
              <input
                type="text"
                id="tireSize"
                name="tireSize"
                value={formData.tireSize}
                onChange={handleInputChange}
                placeholder="205/55R16"
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.tireSize
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.tireSize && (
                <p className="mt-1 text-sm text-red-600">{errors.tireSize}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kilométrage */}
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700"
              >
                Kilométrage *
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage || ""}
                onChange={handleInputChange}
                placeholder="45000"
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.mileage
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
              )}
            </div>

            {/* Coût */}
            <div>
              <label
                htmlFor="cost"
                className="block text-sm font-medium text-gray-700"
              >
                Coût (TND) *
              </label>
              <input
                type="number"
                step="0.01"
                id="cost"
                name="cost"
                value={formData.cost || ""}
                onChange={handleInputChange}
                placeholder="180.00"
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.cost
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Centre de service */}
            <div>
              <label
                htmlFor="serviceCenter"
                className="block text-sm font-medium text-gray-700"
              >
                Centre de service
              </label>
              <input
                type="text"
                id="serviceCenter"
                name="serviceCenter"
                value={formData.serviceCenter}
                onChange={handleInputChange}
                placeholder="Garage Auto Tunis"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            {/* Technicien */}
            <div>
              <label
                htmlFor="technician"
                className="block text-sm font-medium text-gray-700"
              >
                Technicien
              </label>
              <input
                type="text"
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
                placeholder="Mohamed Trabelsi"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Informations supplémentaires..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/tire-change")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TireChangeForm;
