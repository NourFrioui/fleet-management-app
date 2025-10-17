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
  Droplet,
} from "lucide-react";
import type { Washing, Vehicle } from "../types";

const WashingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");

  // Mock data - à remplacer par un vrai service
  const mockWashings: Washing[] = [
    {
      id: "1",
      vehicleId: "1",
      type: "complete",
      cost: 25,
      date: "2024-03-20",
      location: "Station Lavage Tunis Centre",
      mileage: 48500,
      notes: "Lavage complet intérieur et extérieur",
      createdAt: "2024-03-20T09:00:00Z",
      updatedAt: "2024-03-20T09:00:00Z",
    },
    {
      id: "2",
      vehicleId: "2",
      type: "exterior",
      cost: 15,
      date: "2024-03-18",
      location: "Lavage Express Sfax",
      mileage: 52000,
      notes: "Lavage extérieur uniquement",
      createdAt: "2024-03-18T14:30:00Z",
      updatedAt: "2024-03-18T14:30:00Z",
    },
    {
      id: "3",
      vehicleId: "1",
      type: "express",
      cost: 10,
      date: "2024-03-15",
      location: "Station Lavage Tunis Centre",
      mileage: 48200,
      notes: "Lavage rapide",
      createdAt: "2024-03-15T11:00:00Z",
      updatedAt: "2024-03-15T11:00:00Z",
    },
    {
      id: "4",
      vehicleId: "3",
      type: "interior",
      cost: 20,
      date: "2024-03-12",
      location: "Centre Auto Sousse",
      mileage: 35600,
      notes: "Nettoyage intérieur approfondi avec aspiration",
      createdAt: "2024-03-12T10:15:00Z",
      updatedAt: "2024-03-12T10:15:00Z",
    },
  ];

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
    {
      id: "2",
      plateNumber: "456 TUN 7890",
      brand: "Peugeot",
      model: "208",
      year: 2021,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 52500,
      fuelType: "diesel",
      color: "Blanc",
      purchaseDate: "2021-03-10",
      lastMaintenanceDate: "2024-03-10",
      nextMaintenanceDate: "2024-09-10",
      createdAt: "2021-03-10T00:00:00Z",
      updatedAt: "2024-03-10T00:00:00Z",
    },
    {
      id: "3",
      plateNumber: "789 TUN 1234",
      brand: "Volkswagen",
      model: "Polo",
      year: 2019,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 35600,
      fuelType: "gasoline",
      color: "Noir",
      purchaseDate: "2019-06-01",
      lastMaintenanceDate: "2024-03-12",
      nextMaintenanceDate: "2024-09-12",
      createdAt: "2019-06-01T00:00:00Z",
      updatedAt: "2024-03-12T00:00:00Z",
    },
  ];

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      exterior: "Extérieur",
      interior: "Intérieur",
      complete: "Complet",
      express: "Express",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      exterior: "bg-blue-100 text-blue-800",
      interior: "bg-green-100 text-green-800",
      complete: "bg-purple-100 text-purple-800",
      express: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`
      : "Véhicule inconnu";
  };

  const filteredWashings = mockWashings.filter((washing) => {
    const matchesSearch =
      searchTerm === "" ||
      getVehicleInfo(washing.vehicleId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (washing.location &&
        washing.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "" || washing.type === filterType;

    const matchesVehicle =
      filterVehicle === "" || washing.vehicleId === filterVehicle;

    return matchesSearch && matchesType && matchesVehicle;
  });

  const totalCost = filteredWashings.reduce(
    (sum, washing) => sum + washing.cost,
    0
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lavage ?")) {
      // Logique de suppression
      console.log("Delete washing:", id);
    }
  };

  const handleExport = () => {
    console.log("Export washings data");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lavage</h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez tous les lavages de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/washing/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau lavage
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lavages</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWashings.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Droplet className="h-6 w-6 text-blue-600" />
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
                {filteredWashings.length > 0
                  ? (totalCost / filteredWashings.length).toFixed(2)
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
                {new Set(filteredWashings.map((w) => w.vehicleId)).size}
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="exterior">Extérieur</option>
            <option value="interior">Intérieur</option>
            <option value="complete">Complet</option>
            <option value="express">Express</option>
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

      {/* Liste des lavages */}
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
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWashings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Aucun lavage trouvé</p>
                  </td>
                </tr>
              ) : (
                filteredWashings.map((washing) => (
                  <tr key={washing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(washing.date).toLocaleDateString("fr-TN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getVehicleInfo(washing.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                          washing.type
                        )}`}
                      >
                        {getTypeLabel(washing.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {washing.location || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {washing.mileage
                        ? `${washing.mileage.toLocaleString()} km`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {washing.cost.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/washing/${washing.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(washing.id)}
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

export default WashingPage;
