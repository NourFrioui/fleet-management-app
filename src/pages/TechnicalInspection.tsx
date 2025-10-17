import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  ClipboardCheck,
} from "lucide-react";
import { mockTechnicalInspections, mockVehicles } from "../data/mockData";
import {
  exportToCSV,
  formatDateForExport,
  formatAmountForExport,
} from "../utils/exportUtils";

const TechnicalInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<string>("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`
      : "Véhicule inconnu";
  };

  const filteredInspections = mockTechnicalInspections.filter((inspection) => {
    const matchesSearch =
      searchTerm === "" ||
      inspection.inspectionCenter
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.inspectorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getVehicleInfo(inspection.vehicleId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesResult =
      filterResult === "" || inspection.result === filterResult;

    const matchesVehicle =
      filterVehicle === "" || inspection.vehicleId === filterVehicle;

    return matchesSearch && matchesResult && matchesVehicle;
  });

  const totalCost = filteredInspections.reduce(
    (sum, inspection) => sum + inspection.cost,
    0
  );

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette visite technique ?"
      )
    ) {
      console.log("Delete inspection:", id);
    }
  };

  const handleExport = () => {
    const exportData = filteredInspections.map((inspection) => ({
      date: formatDateForExport(inspection.inspectionDate),
      vehicule: getVehicleInfo(inspection.vehicleId),
      type: inspection.inspectionType.replace("_", " "),
      resultat:
        inspection.result === "favorable"
          ? "Favorable"
          : inspection.result === "unfavorable"
          ? "Défavorable"
          : "Avec réserves",
      expiration: formatDateForExport(inspection.expiryDate),
      kilometrage: inspection.mileage,
      cout: formatAmountForExport(inspection.cost),
      centre: inspection.inspectionCenter,
      inspecteur: inspection.inspectorName,
    }));

    const headers = [
      { key: "date", label: "Date" },
      { key: "vehicule", label: "Véhicule" },
      { key: "type", label: "Type" },
      { key: "resultat", label: "Résultat" },
      { key: "expiration", label: "Expiration" },
      { key: "kilometrage", label: "Kilométrage (km)" },
      { key: "cout", label: "Coût" },
      { key: "centre", label: "Centre" },
      { key: "inspecteur", label: "Inspecteur" },
    ];

    exportToCSV(exportData, headers, "visites_techniques");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visite Technique</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez toutes les visites techniques de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/technical-inspection/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle visite
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visites</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInspections.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCost.toFixed(2)} TND
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInspections.length > 0
                  ? (totalCost / filteredInspections.length).toFixed(2)
                  : "0.00"}{" "}
                TND
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Véhicules</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(filteredInspections.map((i) => i.vehicleId)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les résultats</option>
            <option value="favorable">Favorable</option>
            <option value="unfavorable">Défavorable</option>
            <option value="favorable_with_restrictions">
              Favorable avec réserves
            </option>
          </select>

          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les véhicules</option>
            {mockVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Liste des visites */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résultat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Centre
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      Aucune visite technique trouvée
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspection.inspectionDate).toLocaleDateString(
                        "fr-TN"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getVehicleInfo(inspection.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {inspection.inspectionType.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inspection.result === "favorable"
                            ? "bg-green-100 text-green-800"
                            : inspection.result === "unfavorable"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {inspection.result === "favorable"
                          ? "Favorable"
                          : inspection.result === "unfavorable"
                          ? "Défavorable"
                          : "Avec réserves"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspection.expiryDate).toLocaleDateString(
                        "fr-TN"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inspection.cost.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inspection.inspectionCenter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/technical-inspection/${inspection.id}`)
                        }
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Voir détails"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inspection.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TechnicalInspectionPage;
