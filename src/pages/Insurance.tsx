import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { mockVehicles } from "../data/mockData";
import { INSURANCE_TYPES, INSURANCE_STATUSES } from "../utils/vehicleConstants";
import type {
  Insurance as InsuranceType,
  Vehicle,
  InsuranceFilters,
} from "../types";

const Insurance: React.FC = () => {
  const navigate = useNavigate();
  const [insurances, setInsurances] = useState<InsuranceType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InsuranceFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En production, remplacer par les appels API
        setVehicles(mockVehicles);

        // Données d'assurance mockées
        const mockInsurances: InsuranceType[] = [
          {
            id: "1",
            vehicleId: "1",
            type: "comprehensive",
            company: "STAR Assurances",
            policyNumber: "POL-123456",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            premium: 2400, // Obsolète
            premiumExcludingTax: 2016.0,
            vatRate: 19,
            vatAmount: 383.04,
            fiscalStamp: 1.0,
            otherTaxes: 0,
            totalTaxAmount: 384.04,
            premiumIncludingTax: 2400.04,
            coverage: 50000,
            deductible: 500,
            status: "active",
            agentName: "Mohamed Ben Ali",
            agentPhone: "+216 71 234 567",
            notes: "Assurance tous risques avec assistance 24h/24",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "2",
            vehicleId: "2",
            type: "third_party",
            company: "GAT Assurances",
            policyNumber: "POL-789012",
            startDate: "2023-06-01",
            endDate: "2024-05-31",
            premium: 1600, // Obsolète
            premiumExcludingTax: 1344.0,
            vatRate: 19,
            vatAmount: 255.36,
            fiscalStamp: 1.0,
            otherTaxes: 0,
            totalTaxAmount: 256.36,
            premiumIncludingTax: 1600.36,
            coverage: 30000,
            deductible: 800,
            status: "expired",
            agentName: "Fatma Trabelsi",
            agentPhone: "+216 74 456 789",
            notes: "Assurance au tiers",
            createdAt: "2023-06-01T00:00:00Z",
            updatedAt: "2023-06-01T00:00:00Z",
          },
          {
            id: "3",
            vehicleId: "3",
            type: "commercial",
            company: "COMAR",
            policyNumber: "POL-345678",
            startDate: "2024-03-01",
            endDate: "2025-02-28",
            premium: 3000, // Obsolète
            premiumExcludingTax: 2520.0,
            vatRate: 19,
            vatAmount: 478.8,
            fiscalStamp: 1.0,
            otherTaxes: 0,
            totalTaxAmount: 479.8,
            premiumIncludingTax: 2999.8,
            coverage: 75000,
            deductible: 400,
            status: "active",
            agentName: "Ahmed Karray",
            agentPhone: "+216 73 789 123",
            notes: "Assurance commerciale pour véhicule de service",
            createdAt: "2024-03-01T00:00:00Z",
            updatedAt: "2024-03-01T00:00:00Z",
          },
        ];

        setInsurances(mockInsurances);
      } catch (error) {
        console.error("Erreur lors du chargement des assurances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInsuranceStatusColor = (status: string) => {
    const statusObj = INSURANCE_STATUSES.find((s) => s.value === status);
    switch (statusObj?.color) {
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "gray":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsuranceTypeText = (type: string) => {
    const typeObj = INSURANCE_TYPES.find((t) => t.value === type);
    return typeObj?.label || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  };

  // Fonction pour renouveler une assurance
  const handleRenewal = (insurance: InsuranceType) => {
    // Calculer les nouvelles dates (démarrer le jour après l'expiration)
    const oldEndDate = new Date(insurance.endDate);
    const newStartDate = new Date(oldEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    // Naviguer vers le formulaire avec les données pré-remplies
    const params = new URLSearchParams({
      renew: "true",
      vehicleId: insurance.vehicleId,
      type: insurance.type,
      company: insurance.company,
      premium: insurance.premium.toString(),
      coverage: insurance.coverage.toString(),
      deductible: insurance.deductible.toString(),
      agentName: insurance.agentName || "",
      agentPhone: insurance.agentPhone || "",
      startDate: newStartDate.toISOString().split("T")[0],
      endDate: newEndDate.toISOString().split("T")[0],
    });

    navigate(`/insurance/new?${params.toString()}`);
  };

  const filteredInsurances = insurances.filter((insurance) => {
    const vehicle = vehicles.find((v) => v.id === insurance.vehicleId);
    const matchesSearch =
      insurance.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle &&
        `${vehicle.plateNumber} ${vehicle.brand} ${vehicle.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesFilters =
      (!filters.status || insurance.status === filters.status) &&
      (!filters.type || insurance.type === filters.type) &&
      (!filters.company ||
        insurance.company
          .toLowerCase()
          .includes(filters.company.toLowerCase())) &&
      (!filters.vehicleId || insurance.vehicleId === filters.vehicleId);

    return matchesSearch && matchesFilters;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Assurances
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivi et gestion des contrats d'assurance des véhicules
          </p>
        </div>
        <Link
          to="/insurance/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle assurance
        </Link>
      </div>

      {/* Alertes */}
      {insurances.some((insurance) => isExpired(insurance.endDate)) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Assurances expirées
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {
                    insurances.filter((insurance) =>
                      isExpired(insurance.endDate)
                    ).length
                  }{" "}
                  assurance(s) ont expiré et nécessitent un renouvellement
                  immédiat.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {insurances.some((insurance) => isExpiringSoon(insurance.endDate)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Assurances expirant bientôt
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {
                    insurances.filter((insurance) =>
                      isExpiringSoon(insurance.endDate)
                    ).length
                  }{" "}
                  assurance(s) expirent dans les 30 prochains jours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro de police, compagnie ou véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value || undefined,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Tous les statuts</option>
                  {INSURANCE_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value || undefined,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Tous les types</option>
                  {INSURANCE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compagnie
                </label>
                <input
                  type="text"
                  placeholder="Ex: AXA"
                  value={filters.company || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      company: e.target.value || undefined,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Véhicule
                </label>
                <select
                  value={filters.vehicleId || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      vehicleId: e.target.value || undefined,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Tous les véhicules</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des assurances */}
      {filteredInsurances.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucune assurance trouvée
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some((f) => f)
              ? "Aucune assurance ne correspond à vos critères de recherche."
              : "Commencez par ajouter une nouvelle assurance."}
          </p>
          {!searchTerm && !Object.values(filters).some((f) => f) && (
            <div className="mt-6">
              <Link
                to="/insurance/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une assurance
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredInsurances.map((insurance) => {
              const vehicle = vehicles.find(
                (v) => v.id === insurance.vehicleId
              );
              return (
                <li key={insurance.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(insurance.status)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {insurance.policyNumber} - {insurance.company}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInsuranceStatusColor(
                                insurance.status
                              )}`}
                            >
                              {insurance.status === "active"
                                ? "Active"
                                : insurance.status === "expired"
                                ? "Expirée"
                                : "Annulée"}
                            </span>
                            {isExpiringSoon(insurance.endDate) &&
                              insurance.status === "active" && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Expire bientôt
                                </span>
                              )}
                            {isExpired(insurance.endDate) &&
                              insurance.status === "active" && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Expirée
                                </span>
                              )}
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-500">
                              {vehicle
                                ? `${vehicle.plateNumber} - ${vehicle.brand} ${vehicle.model}`
                                : "Véhicule non trouvé"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getInsuranceTypeText(insurance.type)} •{" "}
                              {insurance.premium} DT/an
                            </p>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Du{" "}
                              {new Date(
                                insurance.startDate
                              ).toLocaleDateString()}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              Au{" "}
                              {new Date(insurance.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/insurance/${insurance.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/insurance/${insurance.id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleRenewal(insurance)}
                          className="text-green-600 hover:text-green-900"
                          title="Renouveler l'assurance"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Insurance;
