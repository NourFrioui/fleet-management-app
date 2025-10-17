import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Truck,
  Car,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { Vehicle, VehicleFilters } from "../types";
import { mockVehicles } from "../data/mockData";

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<VehicleFilters>({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // En production, remplacer par : const response = await vehicleService.getAll(filters);
        setVehicles(mockVehicles);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || vehicle.status === filters.status;
    const matchesType = !filters.type || vehicle.type === filters.type;
    const matchesFuelType =
      !filters.fuelType || vehicle.fuelType === filters.fuelType;

    return matchesSearch && matchesStatus && matchesType && matchesFuelType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "maintenance":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "inactive":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "maintenance":
        return "Maintenance";
      case "inactive":
        return "Inactif";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "truck":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "car":
        return <Car className="h-5 w-5 text-green-500" />;
      case "van":
        return <Truck className="h-5 w-5 text-purple-500" />;
      default:
        return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "truck":
        return "Camion";
      case "car":
        return "Voiture";
      case "van":
        return "Van";
      default:
        return type;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        // await vehicleService.delete(id);
        setVehicles(vehicles.filter((v) => v.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Véhicules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion de votre flotte de véhicules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/vehicles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Recherche */}
          <div className="sm:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Rechercher
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Plaque, marque, modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre statut */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Statut
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value || undefined })
              }
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          {/* Filtre type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value || undefined })
              }
            >
              <option value="">Tous les types</option>
              <option value="truck">Camion</option>
              <option value="car">Voiture</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des véhicules */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredVehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getTypeIcon(vehicle.type)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {vehicle.plateNumber}
                        </p>
                        <div className="ml-2 flex items-center">
                          {getStatusIcon(vehicle.status)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p className="truncate">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </p>
                        <span className="mx-2">•</span>
                        <p>{getTypeText(vehicle.type)}</p>
                        <span className="mx-2">•</span>
                        <p>{vehicle.mileage.toLocaleString()} km</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/vehicles/${vehicle.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Prochaine maintenance:{" "}
                      {new Date(
                        vehicle.nextMaintenanceDate
                      ).toLocaleDateString()}
                    </span>
                    {vehicle.assignedDriverId && <span>Chauffeur assigné</span>}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === "active"
                          ? "bg-green-100 text-green-800"
                          : vehicle.status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun véhicule trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter un nouveau véhicule."}
            </p>
            {!searchTerm && !Object.values(filters).some((f) => f) && (
              <div className="mt-6">
                <Link
                  to="/vehicles/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un véhicule
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
