import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3,
  PieChart,
  Fuel,
  TrendingUp,
} from "lucide-react";
import type { DashboardStats } from "../types";
import { mockDashboardStats } from "../data/mockData";
import {
  FuelConsumptionChart,
  MaintenanceCostsChart,
  VehicleTypeChart,
  VehicleStatusChart,
  MonthlyCostsChart,
  DriverPerformanceChart,
  AlertsChart,
} from "../components/Charts";

const DashboardModern: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Véhicules Actifs",
      value: stats.activeVehicles,
      total: stats.totalVehicles,
      icon: Truck,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/vehicles",
    },
    {
      title: "Chauffeurs Actifs",
      value: stats.activeDrivers,
      total: stats.totalDrivers,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      link: "/drivers",
    },
    {
      title: "Maintenances à Venir",
      value: stats.upcomingMaintenance,
      icon: Calendar,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      link: "/maintenance",
    },
    {
      title: "Coût Mensuel Carburant",
      value: `${stats.monthlyFuelCost.toLocaleString()}TND`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/fuel",
    },
  ];

  const quickActions = [
    {
      title: "Ajouter un véhicule",
      description: "Enregistrer un nouveau véhicule",
      icon: Truck,
      link: "/vehicles/new",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Ajouter un chauffeur",
      description: "Enregistrer un nouveau chauffeur",
      icon: Users,
      link: "/drivers/new",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Planifier une maintenance",
      description: "Programmer un entretien",
      icon: Calendar,
      link: "/maintenance/new",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Enregistrer du carburant",
      description: "Ajouter un plein",
      icon: DollarSign,
      link: "/fuel/new",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Eye },
    { id: "analytics", label: "Analyses", icon: BarChart3 },
    { id: "reports", label: "Rapports", icon: PieChart },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <Link
                  key={index}
                  to={stat.link}
                  className="card card-hover p-6 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        {stat.total && (
                          <p className="ml-2 text-sm text-gray-500">
                            / {stat.total}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="card card-hover p-6 group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Graphiques et répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Répartition des véhicules par type */}
              <div className="card card-hover p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Répartition des véhicules
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.vehiclesByType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            type === "truck"
                              ? "bg-blue-500"
                              : type === "car"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type === "truck"
                            ? "Camions"
                            : type === "car"
                            ? "Voitures"
                            : "Vans"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Répartition des maintenances */}
              <div className="card card-hover p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Types de maintenance
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.maintenanceByType).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              type === "routine"
                                ? "bg-blue-500"
                                : type === "repair"
                                ? "bg-red-500"
                                : type === "inspection"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {type === "routine"
                              ? "Routine"
                              : type === "repair"
                              ? "Réparation"
                              : type === "inspection"
                              ? "Inspection"
                              : "Vidange"}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Alertes et notifications */}
            <div className="card card-hover p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alertes importantes
              </h3>
              <div className="space-y-3">
                {stats.upcomingMaintenance > 0 && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        {stats.upcomingMaintenance} maintenance(s) programmée(s)
                      </p>
                      <p className="text-xs text-yellow-600">
                        Vérifiez le calendrier pour plus de détails
                      </p>
                    </div>
                  </div>
                )}
                {stats.maintenanceVehicles > 0 && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {stats.maintenanceVehicles} véhicule(s) en maintenance
                      </p>
                      <p className="text-xs text-red-600">
                        Suivez l'avancement des réparations
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Consommation moyenne : {stats.averageFuelConsumption}
                      L/100km
                    </p>
                    <p className="text-xs text-green-600">
                      Performance optimale de la flotte
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques de Carburant */}
            <div className="card card-hover p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Statistiques de Carburant
                </h3>
                <Link
                  to="/fuel-statistics"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Voir détails →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Fuel className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-900">
                    Coût Mensuel
                  </p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {stats.monthlyFuelCost.toLocaleString()} TND
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-900">
                    Consommation Moy.
                  </p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {stats.averageFuelConsumption} L/100km
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-purple-900">
                    Coût/Litre Moy.
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">
                    2.10 TND
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FuelConsumptionChart />
              <MaintenanceCostsChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VehicleTypeChart />
              <VehicleStatusChart />
            </div>
            <MonthlyCostsChart />
            <DriverPerformanceChart />
          </div>
        );

      case "reports":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AlertsChart />
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rapport de performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Efficacité carburant
                    </span>
                    <span className="text-lg font-bold text-blue-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Disponibilité véhicules
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      92%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Coût moyen/km
                    </span>
                    <span className="text-lg font-bold text-yellow-600">
                      0.45TND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Vue d'ensemble de votre flotte</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
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
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {renderTabContent()}
    </div>
  );
};

export default DashboardModern;
