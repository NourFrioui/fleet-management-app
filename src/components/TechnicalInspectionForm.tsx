import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, X, ClipboardCheck, Plus, Trash2 } from "lucide-react";
import type { TechnicalInspectionFormData, InspectionDefect } from "../types";
import {
  INSPECTION_TYPES,
  INSPECTION_RESULTS,
  DEFECT_CATEGORIES,
  DEFECT_SEVERITY,
} from "../utils/vehicleConstants";
import { mockVehicles } from "../data/mockData";

interface TechnicalInspectionFormProps {
  initialData?: Partial<TechnicalInspectionFormData>;
  isEdit?: boolean;
}

const TechnicalInspectionForm: React.FC<TechnicalInspectionFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle") || "";

  const [formData, setFormData] = useState<TechnicalInspectionFormData>({
    vehicleId: vehicleId,
    inspectionType: "periodic",
    inspectionDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    result: "favorable",
    mileage: 0,
    cost: 0,
    inspectorName: "",
    inspectionCenter: "",
    centerAddress: "",
    centerPhone: "",
    responsible: "",
    defects: [],
    notes: "",
    nextInspectionDate: "",
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
      //   await technicalInspectionService.update(inspectionId, formData);
      // } else {
      //   await technicalInspectionService.create(formData);
      // }

      console.log("Données de visite technique:", formData);
      navigate("/technical-inspection");
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
      [name]: name === "cost" || name === "mileage" ? Number(value) : value,
    }));
  };

  const calculateExpiryDate = () => {
    if (formData.inspectionDate) {
      const inspectionDate = new Date(formData.inspectionDate);
      const expiryDate = new Date(inspectionDate);

      // Ajouter 2 ans pour les visites périodiques
      if (formData.inspectionType === "periodic") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);
      } else {
        // 1 an pour les autres types
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      setFormData((prev) => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split("T")[0],
      }));
    }
  };

  const addDefect = () => {
    const newDefect: InspectionDefect = {
      id: Date.now().toString(),
      category: "",
      description: "",
      severity: "minor",
      rectified: false,
    };
    setFormData((prev) => ({
      ...prev,
      defects: [...(prev.defects || []), newDefect],
    }));
  };

  const removeDefect = (defectId: string) => {
    setFormData((prev) => ({
      ...prev,
      defects: prev.defects?.filter((defect) => defect.id !== defectId) || [],
    }));
  };

  const updateDefect = (
    defectId: string,
    field: keyof InspectionDefect,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      defects:
        prev.defects?.map((defect) =>
          defect.id === defectId ? { ...defect, [field]: value } : defect
        ) || [],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardCheck className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit
                  ? "Modifier la visite technique"
                  : "Nouvelle visite technique"}
              </h2>
            </div>
            <button
              onClick={() => navigate("/technical-inspection")}
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

          {/* Type et dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="inspectionType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type de visite *
              </label>
              <select
                id="inspectionType"
                name="inspectionType"
                required
                value={formData.inspectionType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {INSPECTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="inspectionDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date de visite *
              </label>
              <input
                type="date"
                id="inspectionDate"
                name="inspectionDate"
                required
                value={formData.inspectionDate}
                onChange={handleChange}
                onBlur={calculateExpiryDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date d'expiration *
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Résultat et informations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="result"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Résultat *
              </label>
              <select
                id="result"
                name="result"
                required
                value={formData.result}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {INSPECTION_RESULTS.map((result) => (
                  <option key={result.value} value={result.value}>
                    {result.label}
                  </option>
                ))}
              </select>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="cost"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Coût (€) *
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                required
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Informations sur l'inspecteur et le centre */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="inspectorName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom de l'inspecteur *
              </label>
              <input
                type="text"
                id="inspectorName"
                name="inspectorName"
                required
                value={formData.inspectorName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom de l'inspecteur"
              />
            </div>

            <div>
              <label
                htmlFor="responsible"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Responsable
              </label>
              <input
                type="text"
                id="responsible"
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du responsable"
              />
            </div>

            <div>
              <label
                htmlFor="inspectionCenter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Centre de contrôle *
              </label>
              <input
                type="text"
                id="inspectionCenter"
                name="inspectionCenter"
                required
                value={formData.inspectionCenter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du centre de contrôle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="centerAddress"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse du centre
              </label>
              <input
                type="text"
                id="centerAddress"
                name="centerAddress"
                value={formData.centerAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Adresse complète"
              />
            </div>

            <div>
              <label
                htmlFor="centerPhone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Téléphone du centre
              </label>
              <input
                type="tel"
                id="centerPhone"
                name="centerPhone"
                value={formData.centerPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Numéro de téléphone"
              />
            </div>
          </div>

          {/* Défauts constatés */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Défauts constatés
              </h3>
              <button
                type="button"
                onClick={addDefect}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un défaut
              </button>
            </div>

            {formData.defects && formData.defects.length > 0 && (
              <div className="space-y-4">
                {formData.defects.map((defect, index) => (
                  <div
                    key={defect.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Défaut #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDefect(defect.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={defect.category}
                          onChange={(e) =>
                            updateDefect(defect.id, "category", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {DEFECT_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gravité *
                        </label>
                        <select
                          value={defect.severity}
                          onChange={(e) =>
                            updateDefect(defect.id, "severity", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {DEFECT_SEVERITY.map((severity) => (
                            <option key={severity.value} value={severity.value}>
                              {severity.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`rectified-${defect.id}`}
                          checked={defect.rectified}
                          onChange={(e) =>
                            updateDefect(
                              defect.id,
                              "rectified",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`rectified-${defect.id}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Défaut rectifié
                        </label>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          value={defect.description}
                          onChange={(e) =>
                            updateDefect(
                              defect.id,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Description détaillée du défaut"
                        />
                      </div>

                      {defect.rectified && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date de rectification
                            </label>
                            <input
                              type="date"
                              value={defect.rectificationDate || ""}
                              onChange={(e) =>
                                updateDefect(
                                  defect.id,
                                  "rectificationDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Coût de rectification (€)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={defect.cost || ""}
                              onChange={(e) =>
                                updateDefect(
                                  defect.id,
                                  "cost",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="0.00"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prochaine visite */}
          <div>
            <label
              htmlFor="nextInspectionDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date de prochaine visite
            </label>
            <input
              type="date"
              id="nextInspectionDate"
              name="nextInspectionDate"
              value={formData.nextInspectionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
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
              onClick={() => navigate("/technical-inspection")}
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

export default TechnicalInspectionForm;
