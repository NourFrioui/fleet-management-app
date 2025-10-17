import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, X, Wrench, Plus, Trash2 } from "lucide-react";
import type { MaintenanceFormData, MaintenancePart } from "../types";
import {
  MAINTENANCE_TYPES,
  MAINTENANCE_PRIORITIES,
} from "../utils/vehicleConstants";
import { mockVehicles } from "../data/mockData";

interface MaintenanceFormProps {
  initialData?: Partial<MaintenanceFormData>;
  isEdit?: boolean;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle") || "";

  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicleId: vehicleId,
    type: "routine",
    description: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    cost: 0,
    mileage: 0,
    notes: "",
    technician: "",
    serviceCenter: "",
    parts: [],
    laborHours: 0,
    priority: "medium",
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
      //   await maintenanceService.update(maintenanceId, formData);
      // } else {
      //   await maintenanceService.create(formData);
      // }

      console.log("Données de maintenance:", formData);
      navigate("/maintenance");
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cost" || name === "mileage" || name === "laborHours"
          ? Number(value)
          : value,
    }));
  };

  const addPart = () => {
    const newPart: MaintenancePart = {
      id: Date.now().toString(),
      name: "",
      partNumber: "",
      quantity: 1,
      unitPrice: 0,
      supplier: "",
    };
    setFormData((prev) => ({
      ...prev,
      parts: [...(prev.parts || []), newPart],
    }));
  };

  const removePart = (partId: string) => {
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts?.filter((part) => part.id !== partId) || [],
    }));
  };

  const updatePart = (
    partId: string,
    field: keyof MaintenancePart,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      parts:
        prev.parts?.map((part) =>
          part.id === partId ? { ...part, [field]: value } : part
        ) || [],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wrench className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? "Modifier la maintenance" : "Nouvelle maintenance"}
              </h2>
            </div>
            <button
              onClick={() => navigate("/maintenance")}
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

          {/* Type, priorité et date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type de maintenance *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {MAINTENANCE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priorité *
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {MAINTENANCE_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Décrivez les travaux à effectuer..."
            />
          </div>

          {/* Informations techniques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kilométrage
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="cost"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Coût (€)
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
                htmlFor="laborHours"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Heures de main-d'œuvre
              </label>
              <input
                type="number"
                id="laborHours"
                name="laborHours"
                min="0"
                step="0.5"
                value={formData.laborHours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
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
              placeholder="Nom du garage ou centre de service"
            />
          </div>

          {/* Pièces utilisées */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Pièces utilisées
              </h3>
              <button
                type="button"
                onClick={addPart}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une pièce
              </button>
            </div>

            {formData.parts && formData.parts.length > 0 && (
              <div className="space-y-4">
                {formData.parts.map((part, index) => (
                  <div
                    key={part.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Pièce #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removePart(part.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la pièce *
                        </label>
                        <input
                          type="text"
                          value={part.name}
                          onChange={(e) =>
                            updatePart(part.id, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Ex: Plaquettes de frein"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Référence
                        </label>
                        <input
                          type="text"
                          value={part.partNumber}
                          onChange={(e) =>
                            updatePart(part.id, "partNumber", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Ex: BF001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fournisseur
                        </label>
                        <input
                          type="text"
                          value={part.supplier}
                          onChange={(e) =>
                            updatePart(part.id, "supplier", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Ex: Bosch"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={part.quantity}
                          onChange={(e) =>
                            updatePart(
                              part.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix unitaire (€) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={part.unitPrice}
                          onChange={(e) =>
                            updatePart(
                              part.id,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium">
                            {(part.quantity * part.unitPrice).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              placeholder="Informations complémentaires, observations..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/maintenance")}
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

export default MaintenanceForm;
