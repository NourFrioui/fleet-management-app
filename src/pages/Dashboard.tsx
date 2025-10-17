import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Users,
  Calendar,
  Fuel,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { DashboardStats } from "../types";
import { mockDashboardStats } from "../data/mockData";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // En production, remplacer par : const response = await dashboardService.getStats();
        setStats(mockDashboardStats);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Impossible de charger les statistiques</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Véhicules Actifs",
      value: stats.activeVehicles,
      total: stats.totalVehicles,
      icon: Truck,
      color: "bg-blue-500",
      link: "/vehicles",
    },
    {
      title: "Chauffeurs Actifs",
      value: stats.activeDrivers,
      total: stats.totalDrivers,
      icon: Users,
      color: "bg-green-500",
      link: "/drivers",
    },
    {
      title: "Maintenances à Venir",
      value: stats.upcomingMaintenance,
      icon: Calendar,
      color: "bg-yellow-500",
      link: "/maintenance",
    },
    {
      title: "Coût Carburant Mensuel",
      value: `${stats.monthlyFuelCost.toLocaleString()} €`,
      icon: Fuel,
      color: "bg-red-500",
      link: "/fuel",
    },
  ];

  const quickActions = [
    { title: "Ajouter un Véhicule", link: "/vehicles/new", icon: Truck },
    { title: "Ajouter un Chauffeur", link: "/drivers/new", icon: Users },
    {
      title: "Planifier Maintenance",
      link: "/maintenance/new",
      icon: Calendar,
    },
    { title: "Enregistrer Carburant", link: "/fuel/new", icon: Fuel },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de votre flotte de véhicules
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {card.value}
                        </div>
                        {card.total && (
                          <div className="ml-2 text-sm text-gray-500">
                            / {card.total}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {action.title}
                    </h3>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Répartition des véhicules par type */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Répartition des Véhicules
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.vehiclesByType).map(([type, count]) => {
                const percentage = (count / stats.totalVehicles) * 100;
                const typeLabels = {
                  truck: "Camions",
                  car: "Voitures",
                  van: "Vans",
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {typeLabels[type as keyof typeof typeLabels]}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Maintenances par type */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Maintenances Récentes
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.maintenanceByType).map(([type, count]) => {
                const typeLabels = {
                  routine: "Maintenance Routinière",
                  repair: "Réparation",
                  inspection: "Inspection",
                  oil_change: "Vidange",
                };
                const icons = {
                  routine: CheckCircle,
                  repair: AlertTriangle,
                  inspection: Clock,
                  oil_change: TrendingUp,
                };
                const Icon = icons[type as keyof typeof icons];
                return (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {typeLabels[type as keyof typeof typeLabels]}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary-600">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Consommation moyenne */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Performance de la Flotte
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {stats.averageFuelConsumption}L
              </div>
              <div className="text-sm text-gray-500">
                Consommation moyenne / 100km
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((stats.activeVehicles / stats.totalVehicles) * 100).toFixed(
                  1
                )}
                %
              </div>
              <div className="text-sm text-gray-500">Taux de disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.upcomingMaintenance}
              </div>
              <div className="text-sm text-gray-500">
                Maintenances programmées
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
