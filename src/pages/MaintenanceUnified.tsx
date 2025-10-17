import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Wrench,
  Droplets,
  ClipboardCheck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import type {
  Maintenance,
  OilChange,
  TechnicalInspection,
  MaintenanceFilters,
  OilChangeFilters,
  TechnicalInspectionFilters,
} from "../types";
import { MAINTENANCE_TYPES } from "../utils/vehicleConstants";
import {
  mockMaintenances,
  mockOilChanges,
  mockTechnicalInspections,
} from "../data/mockData";

type TabType = "maintenance" | "oil-change" | "technical-inspection";

const MaintenanceUnified: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("maintenance");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour chaque type
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [technicalInspections, setTechnicalInspections] = useState<
    TechnicalInspection[]
  >([]);

  // Filtres
  const [maintenanceFilters, setMaintenanceFilters] =
    useState<MaintenanceFilters>({});
  const [oilChangeFilters, setOilChangeFilters] = useState<OilChangeFilters>(
    {}
  );
  const [technicalInspectionFilters, setTechnicalInspectionFilters] =
    useState<TechnicalInspectionFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setMaintenances(mockMaintenances);
        setOilChanges(mockOilChanges);
        setTechnicalInspections(mockTechnicalInspections);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage des maintenances
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
      !maintenanceFilters.status ||
      maintenance.status === maintenanceFilters.status;
    const matchesType =
      !maintenanceFilters.type || maintenance.type === maintenanceFilters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Filtrage des vidanges
  const filteredOilChanges = oilChanges.filter((oilChange) => {
    const matchesSearch =
      oilChange.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oilChange.technician?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !oilChangeFilters.status || oilChange.status === oilChangeFilters.status;

    return matchesSearch && matchesStatus;
  });

  // Filtrage des visites techniques
  const filteredTechnicalInspections = technicalInspections.filter(
    (inspection) => {
      const matchesSearch =
        inspection.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspectorName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        inspection.inspectionCenter
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesResult =
        !technicalInspectionFilters.result ||
        inspection.result === technicalInspectionFilters.result;

      return matchesSearch && matchesResult;
    }
  );

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

  const handleDelete = async (id: string, type: TabType) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")
    ) {
      try {
        if (type === "maintenance") {
          setMaintenances(maintenances.filter((m) => m.id !== id));
        } else if (type === "oil-change") {
          setOilChanges(oilChanges.filter((o) => o.id !== id));
        } else if (type === "technical-inspection") {
          setTechnicalInspections(
            technicalInspections.filter((t) => t.id !== id)
          );
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const tabs = [
    {
      id: "maintenance" as TabType,
      name: "Maintenance Générale",
      icon: Wrench,
      count: filteredMaintenances.length,
    },
    {
      id: "oil-change" as TabType,
      name: "Vidange",
      icon: Droplets,
      count: filteredOilChanges.length,
    },
    {
      id: "technical-inspection" as TabType,
      name: "Visite Technique",
      icon: ClipboardCheck,
      count: filteredTechnicalInspections.length,
    },
  ];

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
            Gestion complète de la maintenance de votre flotte
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to={
              activeTab === "maintenance"
                ? "/maintenance/new"
                : activeTab === "oil-change"
                ? "/oil-change/new"
                : "/technical-inspection/new"
            }
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau
          </Link>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
                <span
                  className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-600"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres selon le type d'onglet */}
          {activeTab === "maintenance" && (
            <>
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
                  value={maintenanceFilters.status || ""}
                  onChange={(e) =>
                    setMaintenanceFilters({
                      ...maintenanceFilters,
                      status: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Tous les statuts</option>
                  <option value="scheduled">Programmée</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

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
                  value={maintenanceFilters.type || ""}
                  onChange={(e) =>
                    setMaintenanceFilters({
                      ...maintenanceFilters,
                      type: e.target.value || undefined,
                    })
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
            </>
          )}

          {activeTab === "oil-change" && (
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
                value={oilChangeFilters.status || ""}
                onChange={(e) =>
                  setOilChangeFilters({
                    ...oilChangeFilters,
                    status: e.target.value || undefined,
                  })
                }
              >
                <option value="">Tous les statuts</option>
                <option value="scheduled">Programmée</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          )}

          {activeTab === "technical-inspection" && (
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
                value={technicalInspectionFilters.result || ""}
                onChange={(e) =>
                  setTechnicalInspectionFilters({
                    ...technicalInspectionFilters,
                    result: e.target.value || undefined,
                  })
                }
              >
                <option value="">Tous les résultats</option>
                <option value="favorable">Favorable</option>
                <option value="favorable_with_restrictions">
                  Favorable avec restrictions
                </option>
                <option value="unfavorable">Défavorable</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {/* Maintenance Générale */}
        {activeTab === "maintenance" && (
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
                            Kilométrage: {maintenance.mileage.toLocaleString()}{" "}
                            km
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(
                              maintenance.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          maintenance.status
                        )}`}
                      >
                        {getStatusText(maintenance.status)}
                      </span>
                      {maintenance.cost && (
                        <span className="text-sm font-medium text-gray-900">
                          {maintenance.cost}€
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
                      <button
                        onClick={() =>
                          handleDelete(maintenance.id, "maintenance")
                        }
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredMaintenances.length === 0 && (
              <li className="text-center py-12">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune maintenance trouvée
                </h3>
              </li>
            )}
          </ul>
        )}

        {/* Vidanges */}
        {activeTab === "oil-change" && (
          <ul className="divide-y divide-gray-200">
            {filteredOilChanges.map((oilChange) => (
              <li key={oilChange.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-600 p-2 rounded-full">
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
                          <span>Type: {oilChange.oilType}</span>
                          <span>•</span>
                          <span>Quantité: {oilChange.oilQuantity}L</span>
                          <span>•</span>
                          <span>
                            Kilométrage: {oilChange.mileage.toLocaleString()} km
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(
                              oilChange.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                      <button
                        onClick={() => handleDelete(oilChange.id, "oil-change")}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredOilChanges.length === 0 && (
              <li className="text-center py-12">
                <Droplets className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune vidange trouvée
                </h3>
              </li>
            )}
          </ul>
        )}

        {/* Visites Techniques */}
        {activeTab === "technical-inspection" && (
          <ul className="divide-y divide-gray-200">
            {filteredTechnicalInspections.map((inspection) => (
              <li key={inspection.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-green-600 p-2 rounded-full">
                          <ClipboardCheck className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            Visite Technique - Véhicule {inspection.vehicleId}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                          <span>Inspecteur: {inspection.inspectorName}</span>
                          <span>•</span>
                          <span>Centre: {inspection.inspectionCenter}</span>
                          <span>•</span>
                          <span>
                            Kilométrage: {inspection.mileage.toLocaleString()}{" "}
                            km
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(
                              inspection.inspectionDate
                            ).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            Expire:{" "}
                            {new Date(
                              inspection.expiryDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inspection.result === "favorable"
                            ? "bg-green-100 text-green-800"
                            : inspection.result ===
                              "favorable_with_restrictions"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inspection.result === "favorable"
                          ? "Favorable"
                          : inspection.result === "favorable_with_restrictions"
                          ? "Favorable avec restrictions"
                          : "Défavorable"}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {inspection.cost}€
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
                        onClick={() =>
                          handleDelete(inspection.id, "technical-inspection")
                        }
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredTechnicalInspections.length === 0 && (
              <li className="text-center py-12">
                <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune visite technique trouvée
                </h3>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MaintenanceUnified;
