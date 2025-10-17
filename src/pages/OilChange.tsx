import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Droplets,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import type { OilChange, OilChangeFilters } from "../types";
import { OIL_TYPES } from "../utils/vehicleConstants";
import { mockOilChanges } from "../data/mockData";

const OilChangePage: React.FC = () => {
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<OilChangeFilters>({});

  useEffect(() => {
    const fetchOilChanges = async () => {
      try {
        // En production, remplacer par : const response = await oilChangeService.getAll(filters);
        setOilChanges(mockOilChanges);
      } catch (error) {
        console.error("Erreur lors du chargement des vidanges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOilChanges();
  }, [filters]);

  const filteredOilChanges = oilChanges.filter((oilChange) => {
    const matchesSearch =
      oilChange.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oilChange.technician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oilChange.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oilChange.oilBrand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filters.status || oilChange.status === filters.status;
    const matchesOilType =
      !filters.oilType || oilChange.oilType === filters.oilType;
    const matchesVehicle =
      !filters.vehicleId || oilChange.vehicleId === filters.vehicleId;

    return matchesSearch && matchesStatus && matchesOilType && matchesVehicle;
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

  const getOilTypeText = (oilType: string) => {
    const oilTypeData = OIL_TYPES.find((type) => type.value === oilType);
    return oilTypeData ? oilTypeData.label : oilType;
  };

  const getOilTypeColor = (oilType: string) => {
    const oilTypeData = OIL_TYPES.find((type) => type.value === oilType);
    return oilTypeData
      ? `bg-${oilTypeData.color}-100 text-${oilTypeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vidange ?")) {
      try {
        // await oilChangeService.delete(id);
        setOilChanges(oilChanges.filter((oc) => oc.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleMarkCompleted = async (id: string) => {
    if (window.confirm("Marquer cette vidange comme terminée ?")) {
      try {
        const completedDate = new Date().toISOString().split("T")[0];
        // await oilChangeService.markCompleted(id, completedDate);
        setOilChanges(
          oilChanges.map((oc) =>
            oc.id === id ? { ...oc, status: "completed", completedDate } : oc
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
          <h1 className="text-2xl font-bold text-gray-900">Vidanges</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et suivi des vidanges des véhicules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/oil-change/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vidange
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
                placeholder="Notes, technicien, véhicule, marque..."
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

          {/* Filtre type d'huile */}
          <div>
            <label
              htmlFor="oilType"
              className="block text-sm font-medium text-gray-700"
            >
              Type d'huile
            </label>
            <select
              id="oilType"
              name="oilType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.oilType || ""}
              onChange={(e) =>
                setFilters({ ...filters, oilType: e.target.value || undefined })
              }
            >
              <option value="">Tous les types</option>
              {OIL_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des vidanges */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOilChanges.map((oilChange) => (
            <li key={oilChange.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-600 p-2 rounded-full">
                        <Droplets className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          Vidange - Véhicule {oilChange.vehicleId}
                        </p>
                        <div className="ml-2 flex items-center">
                          {getStatusIcon(oilChange.status)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <span>
                          Kilométrage: {oilChange.mileage.toLocaleString()} km
                        </span>
                        <span>•</span>
                        <span>Quantité: {oilChange.oilQuantity}L</span>
                        <span>•</span>
                        <span>Technicien: {oilChange.technician}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Programmée le:{" "}
                          {new Date(
                            oilChange.scheduledDate
                          ).toLocaleDateString()}
                        </span>
                        {oilChange.completedDate && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Terminée le:{" "}
                              {new Date(
                                oilChange.completedDate
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                        {oilChange.nextOilChangeMileage && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Prochaine:{" "}
                              {oilChange.nextOilChangeMileage.toLocaleString()}{" "}
                              km
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOilTypeColor(
                        oilChange.oilType
                      )}`}
                    >
                      {getOilTypeText(oilChange.oilType)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        oilChange.status
                      )}`}
                    >
                      {getStatusText(oilChange.status)}
                    </span>
                    {oilChange.cost && (
                      <span className="text-sm font-medium text-gray-900">
                        {oilChange.cost}€
                      </span>
                    )}
                    <Link
                      to={`/oil-change/${oilChange.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/oil-change/${oilChange.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    {oilChange.status === "scheduled" && (
                      <button
                        onClick={() => handleMarkCompleted(oilChange.id)}
                        className="text-gray-400 hover:text-green-600"
                        title="Marquer comme terminée"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(oilChange.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {oilChange.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {oilChange.notes}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {filteredOilChanges.length === 0 && (
          <div className="text-center py-12">
            <Droplets className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune vidange trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter une nouvelle vidange."}
            </p>
            {!searchTerm && !Object.values(filters).some((f) => f) && (
              <div className="mt-6">
                <Link
                  to="/oil-change/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle vidange
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OilChangePage;
