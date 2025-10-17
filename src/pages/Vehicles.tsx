import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  Truck,
  MapPin,
} from "lucide-react";
import { mockVehicles } from "../data/mockData";
import { exportToCSV, formatDateForExport } from "../utils/exportUtils";

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      searchTerm === "" ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || vehicle.status === filterStatus;
    const matchesType = filterType === "" || vehicle.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalMileage = filteredVehicles.reduce(
    (sum, vehicle) => sum + (vehicle.mileage || 0),
    0
  );

  const averageMileage =
    filteredVehicles.length > 0 ? totalMileage / filteredVehicles.length : 0;

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      console.log("Delete vehicle:", id);
    }
  };

  const handleExport = () => {
    const exportData = filteredVehicles.map((vehicle) => ({
      immatriculation: vehicle.plateNumber,
      marque: vehicle.brand,
      modele: vehicle.model,
      type:
        vehicle.type === "car"
          ? "Voiture"
          : vehicle.type === "truck"
          ? "Camion"
          : vehicle.type === "van"
          ? "Van"
          : "Autre",
      carburant:
        vehicle.fuelType === "diesel"
          ? "Diesel"
          : vehicle.fuelType === "gasoline"
          ? "Essence"
          : "Électrique",
      annee: vehicle.year,
      kilometrage: vehicle.mileage || 0,
      couleur: vehicle.color || "",
      vin: "",
      statut:
        vehicle.status === "active"
          ? "Actif"
          : vehicle.status === "maintenance"
          ? "Maintenance"
          : "Inactif",
      dateAchat: formatDateForExport(vehicle.purchaseDate),
    }));

    const headers = [
      { key: "immatriculation", label: "Immatriculation" },
      { key: "marque", label: "Marque" },
      { key: "modele", label: "Modèle" },
      { key: "type", label: "Type" },
      { key: "carburant", label: "Carburant" },
      { key: "annee", label: "Année" },
      { key: "kilometrage", label: "Kilométrage (km)" },
      { key: "couleur", label: "Couleur" },
      { key: "vin", label: "VIN" },
      { key: "statut", label: "Statut" },
      { key: "dateAchat", label: "Date d'achat" },
    ];

    exportToCSV(exportData, headers, "vehicules");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Véhicules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez tous les véhicules de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/vehicles/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau véhicule
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Véhicules
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredVehicles.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredVehicles.filter((v) => v.status === "active").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                En Maintenance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  filteredVehicles.filter((v) => v.status === "maintenance")
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Kilométrage Moy.
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageMileage.toFixed(0)} km
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
            <option value="active">Actif</option>
            <option value="maintenance">En maintenance</option>
            <option value="inactive">Inactif</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="car">Voiture</option>
            <option value="truck">Camion</option>
            <option value="van">Van</option>
            <option value="suv">SUV</option>
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

      {/* Liste des véhicules */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immatriculation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carburant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
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
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Aucun véhicule trouvé</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.plateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{vehicle.brand}</p>
                        <p className="text-gray-500">{vehicle.model}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {vehicle.type === "car"
                        ? "Voiture"
                        : vehicle.type === "truck"
                        ? "Camion"
                        : vehicle.type === "van"
                        ? "Van"
                        : "Autre"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {vehicle.fuelType === "diesel"
                        ? "Diesel"
                        : vehicle.fuelType === "gasoline"
                        ? "Essence"
                        : "Électrique"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.mileage?.toLocaleString() || "0"} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.status === "active"
                            ? "bg-green-100 text-green-800"
                            : vehicle.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vehicle.status === "active"
                          ? "Actif"
                          : vehicle.status === "maintenance"
                          ? "Maintenance"
                          : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Voir détails"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
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

export default Vehicles;
