import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Fuel } from "lucide-react";
import { mockVehicles } from "../data/mockData";
import type { FuelConsumptionFormData, Vehicle } from "../types";

interface FuelFormProps {
  isEdit?: boolean;
  fuelRecordId?: string;
}

const FuelForm: React.FC<FuelFormProps> = ({
  isEdit = false,
  fuelRecordId,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle") || fuelRecordId;

  const [formData, setFormData] = useState<FuelConsumptionFormData>({
    vehicleId: vehicleId || "",
    date: new Date().toISOString().split("T")[0],
    fuelType: "diesel",
    quantity: 0,
    cost: 0,
    mileage: 0,
    fuelCardNumber: "",
    station: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // En production, remplacer par : const response = await vehicleService.getAll();
    setVehicles(mockVehicles);
  }, []);

  useEffect(() => {
    if (vehicleId && !formData.vehicleId) {
      setFormData((prev) => ({ ...prev, vehicleId }));
    }
  }, [vehicleId, formData.vehicleId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "cost" || name === "mileage"
          ? parseFloat(value) || 0
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FuelConsumptionFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Véhicule requis";
    }
    if (!formData.date) {
      newErrors.date = "Date requise";
    }
    if (!formData.fuelType) {
      newErrors.fuelType = "Type de carburant requis";
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantité doit être supérieure à 0";
    }
    if (formData.cost <= 0) {
      newErrors.cost = "Coût doit être supérieur à 0";
    }
    if (formData.mileage < 0) {
      newErrors.mileage = "Kilométrage doit être positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // En production, remplacer par :
      // if (isEdit) {
      //   await fuelService.update(fuelRecordId!, formData);
      // } else {
      //   await fuelService.create(formData);
      // }

      console.log("Données du formulaire:", formData);

      // Simulation d'un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/fuel");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/fuel")}
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit
                ? "Modifier l'enregistrement carburant"
                : "Nouvel enregistrement carburant"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Modifiez les informations de l'enregistrement de carburant"
                : "Ajoutez un nouvel enregistrement de consommation de carburant"}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.vehicleId ? "border-red-300" : ""
                }`}
                disabled={!!vehicleId}
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
              )}
              {selectedVehicle && (
                <p className="mt-1 text-sm text-gray-500">
                  Kilométrage actuel: {selectedVehicle.mileage.toLocaleString()}{" "}
                  km
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date du plein *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.date ? "border-red-300" : ""
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Type de carburant */}
            <div>
              <label
                htmlFor="fuelType"
                className="block text-sm font-medium text-gray-700"
              >
                Type de carburant *
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.fuelType ? "border-red-300" : ""
                }`}
              >
                <option value="diesel">Diesel</option>
                <option value="gasoline">Essence</option>
                <option value="electric">Électrique</option>
              </select>
              {errors.fuelType && (
                <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
              )}
            </div>

            {/* Quantité */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantité (litres) *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.quantity ? "border-red-300" : ""
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
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
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.cost ? "border-red-300" : ""
                }`}
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
              )}
            </div>

            {/* Kilométrage */}
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700"
              >
                Kilométrage (km) *
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                min="0"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.mileage ? "border-red-300" : ""
                }`}
              />
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
              )}
            </div>

            {/* Carte carburant */}
            <div>
              <label
                htmlFor="fuelCardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Carte carburant
              </label>
              <input
                type="text"
                id="fuelCardNumber"
                name="fuelCardNumber"
                value={formData.fuelCardNumber}
                onChange={handleInputChange}
                placeholder="Ex: FC001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {selectedVehicle?.fuelCardNumber && !formData.fuelCardNumber && (
                <p className="mt-1 text-sm text-gray-500">
                  Carte assignée au véhicule: {selectedVehicle.fuelCardNumber}
                </p>
              )}
            </div>

            {/* Station */}
            <div>
              <label
                htmlFor="station"
                className="block text-sm font-medium text-gray-700"
              >
                Station-service
              </label>
              <input
                type="text"
                id="station"
                name="station"
                value={formData.station}
                onChange={handleInputChange}
                placeholder="Ex: Station Total - Autoroute A1"
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
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Informations supplémentaires..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          {/* Calcul automatique du prix au litre */}
          {formData.quantity > 0 && formData.cost > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Prix au litre:{" "}
                    {(formData.cost / formData.quantity).toFixed(2)}TND
                  </p>
                  <p className="text-xs text-blue-600">
                    Calcul automatique basé sur la quantité et le coût
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/fuel")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Mettre à jour" : "Enregistrer"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelForm;
