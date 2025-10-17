import React, { useState } from "react";
import { Download, FileText, X } from "lucide-react";
import { mockVehicles } from "../data/mockData";

interface ExportReportProps {
  onClose: () => void;
  reportType: "vehicles" | "drivers" | "maintenance" | "fuel" | "insurance";
}

interface ReportConfig {
  format: "pdf" | "excel" | "csv";
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, any>;
  includeCharts: boolean;
  includeDetails: boolean;
}

const ExportReports: React.FC<ExportReportProps> = ({
  onClose,
  reportType,
}) => {
  const [config, setConfig] = useState<ReportConfig>({
    format: "pdf",
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 jours
      end: new Date().toISOString().split("T")[0],
    },
    filters: {},
    includeCharts: true,
    includeDetails: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const getReportTitle = () => {
    switch (reportType) {
      case "vehicles":
        return "Rapport des véhicules";
      case "drivers":
        return "Rapport des chauffeurs";
      case "maintenance":
        return "Rapport de maintenance";
      case "fuel":
        return "Rapport de consommation";
      case "insurance":
        return "Rapport des assurances";
      default:
        return "Rapport";
    }
  };

  const getAvailableFilters = () => {
    switch (reportType) {
      case "vehicles":
        return [
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Actif" },
              { value: "maintenance", label: "Maintenance" },
              { value: "inactive", label: "Inactif" },
            ],
          },
          {
            id: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "truck", label: "Camion" },
              { value: "car", label: "Voiture" },
              { value: "van", label: "Van" },
            ],
          },
          {
            id: "fuelType",
            label: "Carburant",
            type: "select",
            options: [
              { value: "gasoline", label: "Essence" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Électrique" },
            ],
          },
        ];
      case "drivers":
        return [
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Actif" },
              { value: "suspended", label: "Suspendu" },
              { value: "inactive", label: "Inactif" },
            ],
          },
          { id: "licenseExpiry", label: "Permis expirant", type: "checkbox" },
        ];
      case "maintenance":
        return [
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "scheduled", label: "Programmée" },
              { value: "in_progress", label: "En cours" },
              { value: "completed", label: "Terminée" },
              { value: "cancelled", label: "Annulée" },
            ],
          },
          {
            id: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "routine", label: "Routine" },
              { value: "repair", label: "Réparation" },
              { value: "inspection", label: "Inspection" },
              { value: "oil_change", label: "Vidange" },
            ],
          },
          { id: "costRange", label: "Plage de coût", type: "range" },
        ];
      case "fuel":
        return [
          {
            id: "vehicleId",
            label: "Véhicule",
            type: "select",
            options: mockVehicles.map((v) => ({
              value: v.id,
              label: `${v.plateNumber} - ${v.brand} ${v.model}`,
            })),
          },
          {
            id: "fuelType",
            label: "Type de carburant",
            type: "select",
            options: [
              { value: "gasoline", label: "Essence" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Électrique" },
            ],
          },
          { id: "costRange", label: "Plage de coût", type: "range" },
        ];
      case "insurance":
        return [
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "expired", label: "Expirée" },
              { value: "cancelled", label: "Annulée" },
            ],
          },
          {
            id: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "comprehensive", label: "Tous risques" },
              { value: "third_party", label: "Au tiers" },
              { value: "fire_theft", label: "Vol et incendie" },
              { value: "commercial", label: "Commerciale" },
            ],
          },
          { id: "expiringSoon", label: "Expirant bientôt", type: "checkbox" },
        ];
      default:
        return [];
    }
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterId]: value,
      },
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    // Simulation de génération de rapport
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // En production, ici on appellerait l'API pour générer le rapport
    console.log("Génération du rapport:", {
      type: reportType,
      config,
    });

    setIsGenerating(false);
    alert("Rapport généré avec succès !");
    onClose();
  };

  const renderFilterInput = (filter: any) => {
    switch (filter.type) {
      case "select":
        return (
          <select
            value={config.filters[filter.id] || ""}
            onChange={(e) =>
              handleFilterChange(filter.id, e.target.value || undefined)
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Tous</option>
            {filter.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={config.filters[filter.id] || false}
            onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          />
        );
      case "range":
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={config.filters[`${filter.id}_min`] || ""}
              onChange={(e) =>
                handleFilterChange(
                  `${filter.id}_min`,
                  parseFloat(e.target.value) || undefined
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={config.filters[`${filter.id}_max`] || ""}
              onChange={(e) =>
                handleFilterChange(
                  `${filter.id}_max`,
                  parseFloat(e.target.value) || undefined
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {getReportTitle()}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Format du rapport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format du rapport
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "pdf", label: "PDF", icon: FileText },
                    { value: "excel", label: "Excel", icon: FileText },
                    { value: "csv", label: "CSV", icon: FileText },
                  ].map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            format: format.value as any,
                          }))
                        }
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          config.format === format.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-sm font-medium">
                          {format.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Période */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={config.dateRange.start}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            start: e.target.value,
                          },
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={config.dateRange.end}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value },
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Filtres */}
              {getAvailableFilters().length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Filtres
                    </label>
                    <button
                      onClick={() =>
                        setConfig((prev) => ({ ...prev, filters: {} }))
                      }
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Effacer tout
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getAvailableFilters().map((filter) => (
                      <div key={filter.id}>
                        <label className="block text-xs text-gray-500 mb-1">
                          {filter.label}
                        </label>
                        {renderFilterInput(filter)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options du rapport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options du rapport
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeCharts}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          includeCharts: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Inclure les graphiques
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeDetails}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          includeDetails: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Inclure les détails
                    </span>
                  </label>
                </div>
              </div>

              {/* Résumé */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Résumé du rapport
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Format: {config.format.toUpperCase()}</p>
                  <p>
                    • Période:{" "}
                    {new Date(config.dateRange.start).toLocaleDateString()} -{" "}
                    {new Date(config.dateRange.end).toLocaleDateString()}
                  </p>
                  <p>
                    • Filtres appliqués:{" "}
                    {
                      Object.keys(config.filters).filter(
                        (k) => config.filters[k]
                      ).length
                    }
                  </p>
                  <p>
                    • Graphiques:{" "}
                    {config.includeCharts ? "Inclus" : "Non inclus"}
                  </p>
                  <p>
                    • Détails: {config.includeDetails ? "Inclus" : "Non inclus"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Générer le rapport
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;
