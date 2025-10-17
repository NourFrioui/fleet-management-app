import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { mockVehicles, mockDrivers } from "../data/mockData";
import type { Vehicle, Driver } from "../types";

interface FuelCard {
  id: string;
  cardNumber: string;
  company: string;
  type: "company" | "personal";
  status: "active" | "suspended" | "expired" | "blocked";
  assignedVehicleId?: string;
  assignedDriverId?: string;
  monthlyLimit: number;
  currentUsage: number;
  expiryDate: string;
  lastUsed?: string;
  lastUsedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

const FuelCards: React.FC = () => {
  const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En production, remplacer par les appels API
        setVehicles(mockVehicles);
        setDrivers(mockDrivers);

        // Données de cartes essence mockées
        const mockFuelCards: FuelCard[] = [
          {
            id: "1",
            cardNumber: "FC001",
            company: "Total",
            type: "company",
            status: "active",
            assignedVehicleId: "1",
            assignedDriverId: "1",
            monthlyLimit: 2000,
            currentUsage: 850,
            expiryDate: "2024-12-31",
            lastUsed: "2024-02-01",
            lastUsedAmount: 85.2,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-02-01T00:00:00Z",
          },
          {
            id: "2",
            cardNumber: "FC002",
            company: "Shell",
            type: "company",
            status: "active",
            assignedVehicleId: "2",
            assignedDriverId: "2",
            monthlyLimit: 3000,
            currentUsage: 1200,
            expiryDate: "2024-11-30",
            lastUsed: "2024-01-28",
            lastUsedAmount: 113.6,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-28T00:00:00Z",
          },
          {
            id: "3",
            cardNumber: "FC003",
            company: "BP",
            type: "company",
            status: "suspended",
            assignedVehicleId: "3",
            assignedDriverId: "3",
            monthlyLimit: 1500,
            currentUsage: 1450,
            expiryDate: "2024-10-15",
            lastUsed: "2024-01-25",
            lastUsedAmount: 67.5,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-25T00:00:00Z",
          },
          {
            id: "4",
            cardNumber: "FC004",
            company: "Esso",
            type: "company",
            status: "active",
            assignedVehicleId: "4",
            assignedDriverId: "4",
            monthlyLimit: 2500,
            currentUsage: 920,
            expiryDate: "2025-01-20",
            lastUsed: "2024-01-20",
            lastUsedAmount: 78.1,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-20T00:00:00Z",
          },
          {
            id: "5",
            cardNumber: "FC005",
            company: "Total",
            type: "company",
            status: "expired",
            assignedVehicleId: "5",
            assignedDriverId: "5",
            monthlyLimit: 4000,
            currentUsage: 3800,
            expiryDate: "2024-01-31",
            lastUsed: "2024-01-15",
            lastUsedAmount: 142.0,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z",
          },
        ];

        setFuelCards(mockFuelCards);
      } catch (error) {
        console.error("Erreur lors du chargement des cartes essence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "suspended":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "blocked":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "suspended":
        return "Suspendue";
      case "expired":
        return "Expirée";
      case "blocked":
        return "Bloquée";
      default:
        return status;
    }
  };

  const getUsagePercentage = (currentUsage: number, limit: number) => {
    return (currentUsage / limit) * 100;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
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

  const filteredCards = fuelCards.filter((card) => {
    const matchesSearch =
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || card.status === statusFilter;

    return matchesSearch && matchesStatus;
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
            Gestion des Cartes Essence
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivi et gestion des cartes de carburant de l'entreprise
          </p>
        </div>
        <Link
          to="/fuel-cards/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle carte
        </Link>
      </div>

      {/* Alertes */}
      {fuelCards.some((card) => isExpired(card.expiryDate)) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Cartes expirées
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {fuelCards.filter((card) => isExpired(card.expiryDate)).length}{" "}
                carte(s) ont expiré et nécessitent un renouvellement.
              </p>
            </div>
          </div>
        </div>
      )}

      {fuelCards.some((card) => isExpiringSoon(card.expiryDate)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Cartes expirant bientôt
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                {
                  fuelCards.filter((card) => isExpiringSoon(card.expiryDate))
                    .length
                }{" "}
                carte(s) expirent dans les 30 prochains jours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total des cartes
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {fuelCards.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Cartes actives
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {fuelCards.filter((card) => card.status === "active").length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Usage mensuel
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {fuelCards
                    .reduce((sum, card) => sum + card.currentUsage, 0)
                    .toLocaleString()}
                  TND
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Limites atteintes
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {
                    fuelCards.filter(
                      (card) =>
                        getUsagePercentage(
                          card.currentUsage,
                          card.monthlyLimit
                        ) >= 90
                    ).length
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro de carte ou compagnie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="suspended">Suspendue</option>
              <option value="expired">Expirée</option>
              <option value="blocked">Bloquée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cartes */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucune carte trouvée
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter
              ? "Aucune carte ne correspond à vos critères de recherche."
              : "Commencez par ajouter une nouvelle carte essence."}
          </p>
          {!searchTerm && !statusFilter && (
            <div className="mt-6">
              <Link
                to="/fuel-cards/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une carte
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCards.map((card) => {
              const assignedVehicle = vehicles.find(
                (v) => v.id === card.assignedVehicleId
              );
              const assignedDriver = drivers.find(
                (d) => d.id === card.assignedDriverId
              );
              const usagePercentage = getUsagePercentage(
                card.currentUsage,
                card.monthlyLimit
              );

              return (
                <li key={card.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(card.status)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {card.cardNumber} - {card.company}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                card.status
                              )}`}
                            >
                              {getStatusText(card.status)}
                            </span>
                            {isExpiringSoon(card.expiryDate) &&
                              card.status === "active" && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Expire bientôt
                                </span>
                              )}
                            {isExpired(card.expiryDate) &&
                              card.status === "active" && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Expirée
                                </span>
                              )}
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-500">
                              {assignedVehicle
                                ? `${assignedVehicle.plateNumber} - ${assignedVehicle.brand} ${assignedVehicle.model}`
                                : "Aucun véhicule assigné"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {assignedDriver
                                ? `Chauffeur: ${assignedDriver.name}`
                                : "Aucun chauffeur assigné"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>
                              {card.currentUsage.toLocaleString()}TND /{" "}
                              {card.monthlyLimit.toLocaleString()}TND
                            </span>
                            <span className="mx-2">•</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getUsageColor(
                                usagePercentage
                              )}`}
                            >
                              {usagePercentage.toFixed(1)}% utilisé
                            </span>
                            {card.lastUsed && (
                              <>
                                <span className="mx-2">•</span>
                                <span>
                                  Dernière utilisation:{" "}
                                  {new Date(card.lastUsed).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/fuel-cards/${card.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/fuel-cards/${card.id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Usage mensuel</span>
                        <span>{usagePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            usagePercentage >= 90
                              ? "bg-red-500"
                              : usagePercentage >= 75
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(usagePercentage, 100)}%`,
                          }}
                        ></div>
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

export default FuelCards;
