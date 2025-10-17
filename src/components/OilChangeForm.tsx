import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, X, Droplets } from "lucide-react";
import type { OilChangeFormData } from "../types";
import { OIL_TYPES } from "../utils/vehicleConstants";
import { mockVehicles } from "../data/mockData";

interface OilChangeFormProps {
  initialData?: Partial<OilChangeFormData>;
  isEdit?: boolean;
}

const OilChangeForm: React.FC<OilChangeFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle") || "";

  const [formData, setFormData] = useState<OilChangeFormData>({
    vehicleId: vehicleId,
    scheduledDate: new Date().toISOString().split("T")[0],
    cost: 0,
    mileage: 0,
    oilType: "synthetic",
    oilQuantity: 0,
    oilBrand: "",
    filterChanged: true,
    filterBrand: "",
    notes: "",
    technician: "",
    serviceCenter: "",
    nextOilChangeMileage: 0,
    nextOilChangeDate: "",
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
      //   await oilChangeService.update(oilChangeId, formData);
      // } else {
      //   await oilChangeService.create(formData);
      // }

      console.log("Données de vidange:", formData);
      navigate("/oil-change");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "cost" ||
            name === "mileage" ||
            name === "oilQuantity" ||
            name === "nextOilChangeMileage"
          ? Number(value)
          : value,
    }));
  };

  const calculateNextOilChange = () => {
    if (formData.mileage && formData.oilType) {
      let interval = 10000; // Par défaut 10 000 km

      switch (formData.oilType) {
        case "synthetic":
          interval = 15000;
          break;
        case "semi_synthetic":
          interval = 12000;
          break;
        case "mineral":
          interval = 8000;
          break;
        case "diesel":
          interval = 10000;
          break;
        case "gasoline":
          interval = 10000;
          break;
      }

      const nextMileage = formData.mileage + interval;
      setFormData((prev) => ({
        ...prev,
        nextOilChangeMileage: nextMileage,
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplets className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? "Modifier la vidange" : "Nouvelle vidange"}
              </h2>
            </div>
            <button
              onClick={() => navigate("/oil-change")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection du véhicule */}
          <div>
            <label
              htmlFor="vehicleId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Véhicule *
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              required
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Sélectionner un véhicule</option>
              {mockVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          {/* Date et kilométrage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="scheduledDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date programmée *
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                required
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kilométrage *
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                required
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                onBlur={calculateNextOilChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Type et quantité d'huile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="oilType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type d'huile *
              </label>
              <select
                id="oilType"
                name="oilType"
                required
                value={formData.oilType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {OIL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="oilQuantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantité d'huile (L) *
              </label>
              <input
                type="number"
                id="oilQuantity"
                name="oilQuantity"
                required
                min="0"
                step="0.1"
                value={formData.oilQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.0"
              />
            </div>

            <div>
              <label
                htmlFor="oilBrand"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Marque d'huile
              </label>
              <input
                type="text"
                id="oilBrand"
                name="oilBrand"
                value={formData.oilBrand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Total, Shell, Castrol..."
              />
            </div>
          </div>

          {/* Filtre à huile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filterChanged"
                name="filterChanged"
                checked={formData.filterChanged}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="filterChanged"
                className="ml-2 block text-sm text-gray-900"
              >
                Filtre à huile changé
              </label>
            </div>

            {formData.filterChanged && (
              <div>
                <label
                  htmlFor="filterBrand"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Marque du filtre
                </label>
                <input
                  type="text"
                  id="filterBrand"
                  name="filterBrand"
                  value={formData.filterBrand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Mann, Bosch, Fram..."
                />
              </div>
            )}
          </div>

          {/* Coût et informations techniques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="cost"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Coût (TND)
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="technician"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Technicien
              </label>
              <input
                type="text"
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du technicien"
              />
            </div>

            <div>
              <label
                htmlFor="serviceCenter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Centre de service
              </label>
              <input
                type="text"
                id="serviceCenter"
                name="serviceCenter"
                value={formData.serviceCenter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du garage"
              />
            </div>
          </div>

          {/* Prochaine vidange */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nextOilChangeMileage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prochaine vidange (km)
              </label>
              <input
                type="number"
                id="nextOilChangeMileage"
                name="nextOilChangeMileage"
                min="0"
                value={formData.nextOilChangeMileage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Calculé automatiquement"
              />
            </div>

            <div>
              <label
                htmlFor="nextOilChangeDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date estimée prochaine vidange
              </label>
              <input
                type="date"
                id="nextOilChangeDate"
                name="nextOilChangeDate"
                value={formData.nextOilChangeDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes supplémentaires
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Observations, recommandations..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/oil-change")}
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

export default OilChangeForm;
