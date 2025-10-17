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
  Droplets,
} from "lucide-react";
import { mockOilChanges, mockVehicles } from "../data/mockData";
import {
  exportToCSV,
  formatDateForExport,
  formatAmountForExport,
} from "../utils/exportUtils";

const OilChangePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`
      : "Véhicule inconnu";
  };

  const filteredOilChanges = mockOilChanges.filter((oilChange) => {
    const matchesSearch =
      searchTerm === "" ||
      oilChange.oilBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oilChange.technician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVehicleInfo(oilChange.vehicleId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || oilChange.status === filterStatus;

    const matchesVehicle =
      filterVehicle === "" || oilChange.vehicleId === filterVehicle;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const totalCost = filteredOilChanges.reduce(
    (sum, oc) => sum + (oc.cost || 0),
    0
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vidange ?")) {
      console.log("Delete oil change:", id);
    }
  };

  const handleExport = () => {
    const exportData = filteredOilChanges.map((oilChange) => ({
      date: oilChange.completedDate
        ? formatDateForExport(oilChange.completedDate)
        : formatDateForExport(oilChange.scheduledDate),
      vehicule: getVehicleInfo(oilChange.vehicleId),
      typeHuile: oilChange.oilType,
      marqueHuile: oilChange.oilBrand || "",
      quantite: `${oilChange.oilQuantity} L`,
      kilometrage: oilChange.mileage,
      cout: formatAmountForExport(oilChange.cost || 0),
      centre: oilChange.serviceCenter || "",
      statut:
        oilChange.status === "completed"
          ? "Terminée"
          : oilChange.status === "in_progress"
          ? "En cours"
          : oilChange.status === "scheduled"
          ? "Programmée"
          : "Annulée",
    }));

    const headers = [
      { key: "date", label: "Date" },
      { key: "vehicule", label: "Véhicule" },
      { key: "typeHuile", label: "Type d'huile" },
      { key: "marqueHuile", label: "Marque" },
      { key: "quantite", label: "Quantité" },
      { key: "kilometrage", label: "Kilométrage (km)" },
      { key: "cout", label: "Coût" },
      { key: "centre", label: "Centre" },
      { key: "statut", label: "Statut" },
    ];

    exportToCSV(exportData, headers, "vidanges");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vidange</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez toutes les vidanges de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/oil-change/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle vidange
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Vidanges
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredOilChanges.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Droplets className="h-6 w-6 text-blue-600" />
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
                {filteredOilChanges.length > 0
                  ? (totalCost / filteredOilChanges.length).toFixed(2)
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
                {new Set(filteredOilChanges.map((oc) => oc.vehicleId)).size}
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="scheduled">Programmée</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
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

      {/* Liste des vidanges */}
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
                  Type d'huile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOilChanges.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Aucune vidange trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredOilChanges.map((oilChange) => (
                  <tr key={oilChange.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {oilChange.completedDate
                        ? new Date(oilChange.completedDate).toLocaleDateString(
                            "fr-TN"
                          )
                        : new Date(oilChange.scheduledDate).toLocaleDateString(
                            "fr-TN"
                          )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getVehicleInfo(oilChange.vehicleId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">
                          {oilChange.oilBrand || "-"}
                        </p>
                        <p className="text-gray-500 capitalize">
                          {oilChange.oilType}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {oilChange.oilQuantity} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {oilChange.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {oilChange.cost?.toFixed(2) || "0.00"} TND
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {oilChange.serviceCenter || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          oilChange.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : oilChange.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : oilChange.status === "scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {oilChange.status === "completed"
                          ? "Terminée"
                          : oilChange.status === "in_progress"
                          ? "En cours"
                          : oilChange.status === "scheduled"
                          ? "Programmée"
                          : "Annulée"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/oil-change/${oilChange.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Voir détails"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(oilChange.id)}
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

export default OilChangePage;
