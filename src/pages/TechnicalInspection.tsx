import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import type { TechnicalInspection, TechnicalInspectionFilters } from "../types";
import {
  INSPECTION_TYPES,
  INSPECTION_RESULTS,
} from "../utils/vehicleConstants";
import { mockTechnicalInspections } from "../data/mockData";

const TechnicalInspectionPage: React.FC = () => {
  const [inspections, setInspections] = useState<TechnicalInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TechnicalInspectionFilters>({});

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        // En production, remplacer par : const response = await technicalInspectionService.getAll(filters);
        setInspections(mockTechnicalInspections);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des visites techniques:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [filters]);

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.inspectorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.inspectionCenter
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      !filters.inspectionType ||
      inspection.inspectionType === filters.inspectionType;
    const matchesResult =
      !filters.result || inspection.result === filters.result;
    const matchesVehicle =
      !filters.vehicleId || inspection.vehicleId === filters.vehicleId;
    const matchesCenter =
      !filters.center ||
      inspection.inspectionCenter
        .toLowerCase()
        .includes(filters.center.toLowerCase());

    return (
      matchesSearch &&
      matchesType &&
      matchesResult &&
      matchesVehicle &&
      matchesCenter
    );
  });

  const getResultIcon = (result: string) => {
    switch (result) {
      case "favorable":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "favorable_with_restrictions":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "unfavorable":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "favorable":
        return "Favorable";
      case "favorable_with_restrictions":
        return "Favorable avec restrictions";
      case "unfavorable":
        return "Défavorable";
      default:
        return result;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "favorable":
        return "bg-green-100 text-green-800";
      case "favorable_with_restrictions":
        return "bg-yellow-100 text-yellow-800";
      case "unfavorable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    const typeData = INSPECTION_TYPES.find((t) => t.value === type);
    return typeData ? typeData.label : type;
  };

  const getTypeColor = (type: string) => {
    const typeData = INSPECTION_TYPES.find((t) => t.value === type);
    return typeData
      ? `bg-${typeData.color}-100 text-${typeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette visite technique ?"
      )
    ) {
      try {
        // await technicalInspectionService.delete(id);
        setInspections(inspections.filter((i) => i.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-900">
            Visites Techniques
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et suivi des contrôles techniques des véhicules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/technical-inspection/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle visite technique
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
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
                placeholder="Inspecteur, centre, véhicule, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre type */}
          <div>
            <label
              htmlFor="inspectionType"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="inspectionType"
              name="inspectionType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.inspectionType || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  inspectionType: e.target.value || undefined,
                })
              }
            >
              <option value="">Tous les types</option>
              {INSPECTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre résultat */}
          <div>
            <label
              htmlFor="result"
              className="block text-sm font-medium text-gray-700"
            >
              Résultat
            </label>
            <select
              id="result"
              name="result"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.result || ""}
              onChange={(e) =>
                setFilters({ ...filters, result: e.target.value || undefined })
              }
            >
              <option value="">Tous les résultats</option>
              {INSPECTION_RESULTS.map((result) => (
                <option key={result.value} value={result.value}>
                  {result.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre centre */}
          <div>
            <label
              htmlFor="center"
              className="block text-sm font-medium text-gray-700"
            >
              Centre
            </label>
            <input
              type="text"
              id="center"
              name="center"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              placeholder="Nom du centre"
              value={filters.center || ""}
              onChange={(e) =>
                setFilters({ ...filters, center: e.target.value || undefined })
              }
            />
          </div>
        </div>
      </div>

      {/* Liste des visites techniques */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInspections.map((inspection) => (
            <li key={inspection.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-600 p-2 rounded-full">
                        <ClipboardCheck className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          Visite technique - Véhicule {inspection.vehicleId}
                        </p>
                        <div className="ml-2 flex items-center">
                          {getResultIcon(inspection.result)}
                        </div>
                        {isExpired(inspection.expiryDate) && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expiré
                          </span>
                        )}
                        {isExpiringSoon(inspection.expiryDate) &&
                          !isExpired(inspection.expiryDate) && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Expire bientôt
                            </span>
                          )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <span>
                          Kilométrage: {inspection.mileage.toLocaleString()} km
                        </span>
                        <span>•</span>
                        <span>Inspecteur: {inspection.inspectorName}</span>
                        <span>•</span>
                        <span>Centre: {inspection.inspectionCenter}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Visite le:{" "}
                          {new Date(
                            inspection.inspectionDate
                          ).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          Expire le:{" "}
                          {new Date(inspection.expiryDate).toLocaleDateString()}
                        </span>
                        {inspection.nextInspectionDate && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Prochaine:{" "}
                              {new Date(
                                inspection.nextInspectionDate
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
                        inspection.inspectionType
                      )}`}
                    >
                      {getTypeText(inspection.inspectionType)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(
                        inspection.result
                      )}`}
                    >
                      {getResultText(inspection.result)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {inspection.cost}TND
                    </span>
                    <Link
                      to={`/technical-inspection/${inspection.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/technical-inspection/${inspection.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(inspection.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {inspection.defects && inspection.defects.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">
                      <strong>Défauts constatés:</strong>{" "}
                      {inspection.defects.length} défaut(s)
                      {inspection.defects.some((d) => !d.rectified) && (
                        <span className="text-red-600 ml-2">
                          (
                          {
                            inspection.defects.filter((d) => !d.rectified)
                              .length
                          }{" "}
                          non rectifié(s))
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {inspection.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {inspection.notes}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune visite technique trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter une nouvelle visite technique."}
            </p>
            {!searchTerm && !Object.values(filters).some((f) => f) && (
              <div className="mt-6">
                <Link
                  to="/technical-inspection/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle visite technique
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalInspectionPage;
