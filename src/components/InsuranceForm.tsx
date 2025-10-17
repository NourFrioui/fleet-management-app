import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Calculator } from "lucide-react";
import { mockVehicles } from "../data/mockData";
import { INSURANCE_TYPES } from "../utils/vehicleConstants";
import type { InsuranceFormData, Vehicle } from "../types";

interface InsuranceFormProps {
  isEdit?: boolean;
  insuranceId?: string;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({
  isEdit = false,
  insuranceId,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle") || insuranceId;
  const isRenewal = searchParams.get("renew") === "true";

  const [formData, setFormData] = useState<InsuranceFormData>({
    vehicleId: vehicleId || searchParams.get("vehicleId") || "",
    type: (searchParams.get("type") as any) || "comprehensive",
    company: searchParams.get("company") || "",
    policyNumber: "",
    startDate:
      searchParams.get("startDate") || new Date().toISOString().split("T")[0],
    endDate: searchParams.get("endDate") || "",
    premium: parseFloat(searchParams.get("premium") || "0") || 0, // Obsolète
    premiumExcludingTax: 0,
    vatRate: 19, // TVA standard en Tunisie : 19%
    vatAmount: 0,
    fiscalStamp: 1.0, // Timbre fiscal standard : 1 TND
    otherTaxes: 0,
    totalTaxAmount: 0,
    premiumIncludingTax: 0,
    coverage: parseFloat(searchParams.get("coverage") || "0") || 0,
    deductible: parseFloat(searchParams.get("deductible") || "0") || 0,
    agentName: searchParams.get("agentName") || "",
    agentPhone: searchParams.get("agentPhone") || "",
    notes: isRenewal ? "Renouvellement de l'assurance précédente" : "",
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

  useEffect(() => {
    // Calculer automatiquement la date de fin (1 an après la date de début)
    // Ne pas recalculer si on est en mode renouvellement et que la date de fin est déjà fournie
    if (formData.startDate && !(isRenewal && searchParams.get("endDate"))) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(endDate.getDate() - 1); // Un jour avant pour être exactement 1 an

      setFormData((prev) => ({
        ...prev,
        endDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate, isRenewal, searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let updatedData: any = {
      [name]:
        name === "premium" ||
        name === "coverage" ||
        name === "deductible" ||
        name === "premiumExcludingTax" ||
        name === "vatRate" ||
        name === "fiscalStamp" ||
        name === "otherTaxes"
          ? parseFloat(value) || 0
          : value,
    };

    // Calculer automatiquement toutes les taxes et le prix TTC
    if (
      name === "premiumExcludingTax" ||
      name === "vatRate" ||
      name === "fiscalStamp" ||
      name === "otherTaxes"
    ) {
      const ht =
        name === "premiumExcludingTax"
          ? parseFloat(value) || 0
          : formData.premiumExcludingTax || 0;
      const vatRate =
        name === "vatRate" ? parseFloat(value) || 0 : formData.vatRate || 19;
      const fiscalStamp =
        name === "fiscalStamp"
          ? parseFloat(value) || 0
          : formData.fiscalStamp || 1.0;
      const otherTaxes =
        name === "otherTaxes"
          ? parseFloat(value) || 0
          : formData.otherTaxes || 0;

      // Calculer la TVA
      const vatAmount = (ht * vatRate) / 100;

      // Total des taxes (TVA + Timbre fiscal + Autres)
      const totalTaxAmount = vatAmount + fiscalStamp + otherTaxes;

      // Prix TTC
      const ttc = ht + totalTaxAmount;

      updatedData = {
        ...updatedData,
        vatAmount: Math.round(vatAmount * 100) / 100,
        totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
        premiumIncludingTax: Math.round(ttc * 100) / 100,
        premium: Math.round(ttc * 100) / 100, // Garder l'ancien champ à jour
      };
    }

    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof InsuranceFormData]) {
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
    if (!formData.type) {
      newErrors.type = "Type d'assurance requis";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Compagnie d'assurance requise";
    }
    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Numéro de police requis";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Date de début requise";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Date de fin requise";
    }
    if (formData.premium <= 0) {
      newErrors.premium = "Prime doit être supérieure à 0";
    }
    if (formData.coverage <= 0) {
      newErrors.coverage = "Couverture doit être supérieure à 0";
    }
    if (formData.deductible < 0) {
      newErrors.deductible = "Franchise doit être positive";
    }

    // Vérifier que la date de fin est après la date de début
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "La date de fin doit être après la date de début";
      }
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
      //   await insuranceService.update(insuranceId!, formData);
      // } else {
      //   await insuranceService.create(formData);
      // }

      console.log("Données du formulaire:", formData);

      // Simulation d'un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/insurance");
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
            onClick={() => navigate("/insurance")}
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit
                ? "Modifier l'assurance"
                : isRenewal
                ? "Renouveler l'assurance"
                : "Nouvelle assurance"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Modifiez les informations de l'assurance"
                : isRenewal
                ? "Créez une nouvelle assurance basée sur la précédente"
                : "Ajoutez une nouvelle assurance pour un véhicule"}
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
                  {selectedVehicle.brand} {selectedVehicle.model} -{" "}
                  {selectedVehicle.year}
                </p>
              )}
            </div>

            {/* Type d'assurance */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type d'assurance *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.type ? "border-red-300" : ""
                }`}
              >
                {INSURANCE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Compagnie d'assurance */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Compagnie d'assurance *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Ex: AXA, Groupama, Allianz"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.company ? "border-red-300" : ""
                }`}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            {/* Numéro de police */}
            <div>
              <label
                htmlFor="policyNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de police *
              </label>
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                placeholder="Ex: POL-123456"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.policyNumber ? "border-red-300" : ""
                }`}
              />
              {errors.policyNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.policyNumber}
                </p>
              )}
            </div>

            {/* Date de début */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date de début *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.startDate ? "border-red-300" : ""
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* Date de fin */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date de fin *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.endDate ? "border-red-300" : ""
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Calculée automatiquement (1 an après la date de début)
              </p>
            </div>

            {/* Prix HT */}
            <div>
              <label
                htmlFor="premiumExcludingTax"
                className="block text-sm font-medium text-gray-700"
              >
                Prime annuelle HT (TND) *
              </label>
              <input
                type="number"
                id="premiumExcludingTax"
                name="premiumExcludingTax"
                value={formData.premiumExcludingTax}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.premiumExcludingTax ? "border-red-300" : ""
                }`}
              />
              {errors.premiumExcludingTax && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.premiumExcludingTax}
                </p>
              )}
            </div>

            {/* Taux TVA */}
            <div>
              <label
                htmlFor="vatRate"
                className="block text-sm font-medium text-gray-700"
              >
                Taux TVA (%) *
              </label>
              <select
                id="vatRate"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="19">19% - TVA Standard</option>
                <option value="7">7% - TVA Réduite</option>
                <option value="13">13% - TVA Intermédiaire</option>
                <option value="0">0% - Exonéré</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                TVA standard en Tunisie : 19%
              </p>
            </div>

            {/* Timbre fiscal */}
            <div>
              <label
                htmlFor="fiscalStamp"
                className="block text-sm font-medium text-gray-700"
              >
                Timbre fiscal (TND) *
              </label>
              <input
                type="number"
                id="fiscalStamp"
                name="fiscalStamp"
                value={formData.fiscalStamp}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="1.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Timbre fiscal standard : 1 TND
              </p>
            </div>

            {/* Autres taxes */}
            <div>
              <label
                htmlFor="otherTaxes"
                className="block text-sm font-medium text-gray-700"
              >
                Autres taxes (TND)
              </label>
              <input
                type="number"
                id="otherTaxes"
                name="otherTaxes"
                value={formData.otherTaxes}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Taxes additionnelles (optionnel)
              </p>
            </div>

            {/* Montant TVA (calculé) */}
            <div>
              <label
                htmlFor="vatAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Montant TVA (TND)
              </label>
              <input
                type="text"
                id="vatAmount"
                value={formData.vatAmount?.toFixed(2) || "0.00"}
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm text-gray-700 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Calculé automatiquement
              </p>
            </div>

            {/* Total des taxes (calculé) */}
            <div>
              <label
                htmlFor="totalTaxAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Total des taxes (TND)
              </label>
              <input
                type="text"
                id="totalTaxAmount"
                value={formData.totalTaxAmount?.toFixed(2) || "0.00"}
                disabled
                className="mt-1 block w-full rounded-md bg-blue-50 border-blue-300 shadow-sm font-medium text-blue-900 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                TVA + Timbre fiscal + Autres
              </p>
            </div>

            {/* Prix TTC (calculé) */}
            <div>
              <label
                htmlFor="premiumIncludingTax"
                className="block text-sm font-medium text-gray-700"
              >
                Prime annuelle TTC (TND) *
              </label>
              <input
                type="text"
                id="premiumIncludingTax"
                value={formData.premiumIncludingTax?.toFixed(2) || "0.00"}
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm font-medium text-gray-900 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Prix final incluant la taxe
              </p>
            </div>

            {/* Couverture */}
            <div>
              <label
                htmlFor="coverage"
                className="block text-sm font-medium text-gray-700"
              >
                Couverture (TND) *
              </label>
              <input
                type="number"
                id="coverage"
                name="coverage"
                value={formData.coverage}
                onChange={handleInputChange}
                min="0"
                step="100"
                placeholder="0"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.coverage ? "border-red-300" : ""
                }`}
              />
              {errors.coverage && (
                <p className="mt-1 text-sm text-red-600">{errors.coverage}</p>
              )}
            </div>

            {/* Franchise */}
            <div>
              <label
                htmlFor="deductible"
                className="block text-sm font-medium text-gray-700"
              >
                Franchise (TND) *
              </label>
              <input
                type="number"
                id="deductible"
                name="deductible"
                value={formData.deductible}
                onChange={handleInputChange}
                min="0"
                step="10"
                placeholder="0"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.deductible ? "border-red-300" : ""
                }`}
              />
              {errors.deductible && (
                <p className="mt-1 text-sm text-red-600">{errors.deductible}</p>
              )}
            </div>

            {/* Nom de l'agent */}
            <div>
              <label
                htmlFor="agentName"
                className="block text-sm font-medium text-gray-700"
              >
                Nom de l'agent
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="Ex: Jean Dupont"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            {/* Téléphone de l'agent */}
            <div>
              <label
                htmlFor="agentPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone de l'agent
              </label>
              <input
                type="tel"
                id="agentPhone"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                placeholder="Ex: 01 23 45 67 89"
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
              placeholder="Informations supplémentaires sur l'assurance..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          {/* Résumé des coûts */}
          {formData.premium > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Coût mensuel:{" "}
                    {((formData.premiumIncludingTax || 0) / 12).toFixed(2)} TND
                  </p>
                  <p className="text-xs text-blue-600">
                    Prime annuelle TTC de{" "}
                    {formData.premiumIncludingTax?.toFixed(2) || "0.00"} TND
                    répartie sur 12 mois
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/insurance")}
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

export default InsuranceForm;
