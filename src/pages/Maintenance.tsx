import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import type { Maintenance, MaintenanceFilters } from "../types";
import { MAINTENANCE_TYPES } from "../utils/vehicleConstants";
import { mockMaintenances } from "../data/mockData";

const MaintenancePage: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MaintenanceFilters>({});

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        // En production, remplacer par : const response = await maintenanceService.getAll(filters);
        setMaintenances(mockMaintenances);
      } catch (error) {
        console.error("Erreur lors du chargement des maintenances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, [filters]);

  const filteredMaintenances = maintenances.filter((maintenance) => {
    const matchesSearch =
      maintenance.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      maintenance.technician
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      maintenance.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filters.status || maintenance.status === filters.status;
    const matchesType = !filters.type || maintenance.type === filters.type;
    const matchesVehicle =
      !filters.vehicleId || maintenance.vehicleId === filters.vehicleId;

    return matchesSearch && matchesStatus && matchesType && matchesVehicle;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "scheduled":
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminée";
      case "in_progress":
        return "En cours";
      case "scheduled":
        return "Programmée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    const typeData = MAINTENANCE_TYPES.find((t) => t.value === type);
    return typeData ? typeData.label : type;
  };

  const getTypeColor = (type: string) => {
    const typeData = MAINTENANCE_TYPES.find((t) => t.value === type);
    return typeData
      ? `bg-${typeData.color}-100 text-${typeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?")
    ) {
      try {
        // await maintenanceService.delete(id);
        setMaintenances(maintenances.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleMarkCompleted = async (id: string) => {
    if (window.confirm("Marquer cette maintenance comme terminée ?")) {
      try {
        const completedDate = new Date().toISOString().split("T")[0];
        // await maintenanceService.markCompleted(id, completedDate);
        setMaintenances(
          maintenances.map((m) =>
            m.id === id ? { ...m, status: "completed", completedDate } : m
          )
        );
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et suivi des maintenances des véhicules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/maintenance/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle maintenance
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
                placeholder="Description, technicien, véhicule..."
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
              <option value="scheduled">Programmée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
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
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des maintenances */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMaintenances.map((maintenance) => (
            <li key={maintenance.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-600 p-2 rounded-full">
                        <Wrench className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {maintenance.description}
                        </p>
                        <div className="ml-2 flex items-center">
                          {getStatusIcon(maintenance.status)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <span>Véhicule: {maintenance.vehicleId}</span>
                        <span>•</span>
                        <span>Technicien: {maintenance.technician}</span>
                        <span>•</span>
                        <span>
                          Kilométrage: {maintenance.mileage.toLocaleString()} km
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Programmée le:{" "}
                          {new Date(
                            maintenance.scheduledDate
                          ).toLocaleDateString()}
                        </span>
                        {maintenance.completedDate && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Terminée le:{" "}
                              {new Date(
                                maintenance.completedDate
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        maintenance.type
                      )}`}
                    >
                      {getTypeText(maintenance.type)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        maintenance.status
                      )}`}
                    >
                      {getStatusText(maintenance.status)}
                    </span>
                    {maintenance.cost && (
                      <span className="text-sm font-medium text-gray-900">
                        {maintenance.cost}TND
                      </span>
                    )}
                    <Link
                      to={`/maintenance/${maintenance.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/maintenance/${maintenance.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    {maintenance.status === "scheduled" && (
                      <button
                        onClick={() => handleMarkCompleted(maintenance.id)}
                        className="text-gray-400 hover:text-green-600"
                        title="Marquer comme terminée"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(maintenance.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {maintenance.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {maintenance.notes}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {filteredMaintenances.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune maintenance trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter une nouvelle maintenance."}
            </p>
            {!searchTerm && !Object.values(filters).some((f) => f) && (
              <div className="mt-6">
                <Link
                  to="/maintenance/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle maintenance
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
