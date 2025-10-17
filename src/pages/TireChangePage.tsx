import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import type { TireChange, Vehicle } from "../types";

const TireChangePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");

  // Mock data - à remplacer par un vrai service
  const mockTireChanges: TireChange[] = [
    {
      id: "1",
      vehicleId: "1",
      position: "AVD",
      tireBrand: "Michelin",
      tireModel: "Primacy 4",
      tireSize: "205/55R16",
      mileage: 45000,
      cost: 180,
      date: "2024-03-15",
      serviceCenter: "Garage Auto Tunis",
      technician: "Mohamed Trabelsi",
      notes: "Usure normale, pneu avant droit remplacé",
      createdAt: "2024-03-15T10:00:00Z",
      updatedAt: "2024-03-15T10:00:00Z",
    },
    {
      id: "2",
      vehicleId: "2",
      position: "ARG",
      tireBrand: "Continental",
      tireModel: "ContiPremiumContact",
      tireSize: "215/60R17",
      mileage: 52000,
      cost: 220,
      date: "2024-03-10",
      serviceCenter: "Centre Pneu Sfax",
      technician: "Ahmed Khelifi",
      notes: "Crevaison, pneu arrière gauche remplacé en urgence",
      createdAt: "2024-03-10T14:30:00Z",
      updatedAt: "2024-03-10T14:30:00Z",
    },
    {
      id: "3",
      vehicleId: "1",
      position: "AVG",
      tireBrand: "Bridgestone",
      tireModel: "Turanza T001",
      tireSize: "205/55R16",
      mileage: 48000,
      cost: 195,
      date: "2024-02-20",
      serviceCenter: "Garage Auto Tunis",
      technician: "Mohamed Trabelsi",
      notes: "Changement préventif, usure avancée",
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-02-20T09:15:00Z",
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
  ];

  const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
      AVD: "Avant Droit",
      AVG: "Avant Gauche",
      ARD: "Arrière Droit",
      ARG: "Arrière Gauche",
    };
    return labels[position] || position;
  };

  const getPositionColor = (position: string): string => {
    const colors: Record<string, string> = {
      AVD: "bg-blue-100 text-blue-800",
      AVG: "bg-green-100 text-green-800",
      ARD: "bg-orange-100 text-orange-800",
      ARG: "bg-purple-100 text-purple-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`
      : "Véhicule inconnu";
  };

  const filteredTireChanges = mockTireChanges.filter((change) => {
    const matchesSearch =
      searchTerm === "" ||
      change.tireBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.tireModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVehicleInfo(change.vehicleId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesPosition =
      filterPosition === "" || change.position === filterPosition;

    const matchesVehicle =
      filterVehicle === "" || change.vehicleId === filterVehicle;

    return matchesSearch && matchesPosition && matchesVehicle;
  });

  const totalCost = filteredTireChanges.reduce(
    (sum, change) => sum + change.cost,
    0
  );

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce changement de pneu ?"
      )
    ) {
      // Logique de suppression
      console.log("Delete tire change:", id);
    }
  };

  const handleExport = () => {
    console.log("Export tire changes data");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Changement de Pneus
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez tous les changements de pneus de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/tire-change/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau changement
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Changements
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTireChanges.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
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
                {filteredTireChanges.length > 0
                  ? (totalCost / filteredTireChanges.length).toFixed(2)
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
                {new Set(filteredTireChanges.map((c) => c.vehicleId)).size}
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
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Toutes les positions</option>
            <option value="AVD">Avant Droit</option>
            <option value="AVG">Avant Gauche</option>
            <option value="ARD">Arrière Droit</option>
            <option value="ARG">Arrière Gauche</option>
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

      {/* Liste des changements */}
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
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pneu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
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
              {filteredTireChanges.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      Aucun changement de pneu trouvé
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTireChanges.map((change) => (
                  <tr key={change.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(change.date).toLocaleDateString("fr-TN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getVehicleInfo(change.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(
                          change.position
                        )}`}
                      >
                        {getPositionLabel(change.position)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{change.tireBrand}</p>
                        <p className="text-gray-500">{change.tireModel}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {change.tireSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {change.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {change.cost.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {change.serviceCenter || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/tire-change/${change.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(change.id)}
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

export default TireChangePage;
