import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Fuel,
  Gauge,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  MapPin,
} from "lucide-react";
import { mockFuelRecords, mockVehicles } from "../data/mockData";
import { exportToCSV, formatAmountForExport } from "../utils/exportUtils";

const FuelStatistics: React.FC = () => {
  const [viewMode, setViewMode] = useState<
    "overview" | "daily" | "monthly" | "vehicle"
  >("overview");

  // Calculs statistiques
  const totalCost = mockFuelRecords.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const totalLiters = mockFuelRecords.reduce(
    (sum, record) => sum + record.quantity,
    0
  );
  const averagePricePerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

  // Statistiques par véhicule
  const vehicleStats = mockVehicles
    .map((vehicle) => {
      const vehicleRecords = mockFuelRecords.filter(
        (r) => r.vehicleId === vehicle.id
      );
      const vehicleCost = vehicleRecords.reduce((sum, r) => sum + r.cost, 0);
      const vehicleLiters = vehicleRecords.reduce(
        (sum, r) => sum + r.quantity,
        0
      );

      // Calculer la consommation (L/100km)
      let consumption = 0;
      if (vehicleRecords.length >= 2) {
        const sortedRecords = [...vehicleRecords].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const firstRecord = sortedRecords[0];
        const lastRecord = sortedRecords[sortedRecords.length - 1];
        const kmDriven = lastRecord.mileage - firstRecord.mileage;
        if (kmDriven > 0) {
          consumption = (vehicleLiters / kmDriven) * 100;
        }
      }

      return {
        vehicle,
        totalCost: vehicleCost,
        totalLiters: vehicleLiters,
        recordCount: vehicleRecords.length,
        consumption: consumption,
        efficiency:
          consumption <= 6
            ? "excellent"
            : consumption <= 8
            ? "good"
            : consumption <= 10
            ? "average"
            : "poor",
      };
    })
    .filter((stat) => stat.recordCount > 0);

  // Statistiques par mois
  const monthlyStats = mockFuelRecords.reduce((acc, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, cost: 0, liters: 0, count: 0 };
    }

    acc[monthKey].cost += record.cost;
    acc[monthKey].liters += record.quantity;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, { month: string; cost: number; liters: number; count: number }>);

  const monthlyData = Object.values(monthlyStats).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // Statistiques par type de carburant
  const fuelTypeStats = mockFuelRecords.reduce((acc, record) => {
    if (!acc[record.fuelType]) {
      acc[record.fuelType] = { cost: 0, liters: 0, count: 0 };
    }
    acc[record.fuelType].cost += record.cost;
    acc[record.fuelType].liters += record.quantity;
    acc[record.fuelType].count += 1;
    return acc;
  }, {} as Record<string, { cost: number; liters: number; count: number }>);

  // Statistiques par station
  const stationStats = mockFuelRecords.reduce((acc, record) => {
    const station = record.station || "Non spécifié";
    if (!acc[station]) {
      acc[station] = { cost: 0, liters: 0, count: 0 };
    }
    acc[station].cost += record.cost;
    acc[station].liters += record.quantity;
    acc[station].count += 1;
    return acc;
  }, {} as Record<string, { cost: number; liters: number; count: number }>);

  const handleExport = () => {
    if (viewMode === "vehicle") {
      const exportData = vehicleStats.map((stat) => ({
        vehicule: `${stat.vehicle.brand} ${stat.vehicle.model} - ${stat.vehicle.plateNumber}`,
        coutTotal: formatAmountForExport(stat.totalCost),
        litresTotal: `${stat.totalLiters.toFixed(2)} L`,
        nombrePleins: stat.recordCount,
        consommation:
          stat.consumption > 0
            ? `${stat.consumption.toFixed(2)} L/100km`
            : "N/A",
        efficacite:
          stat.efficiency === "excellent"
            ? "Excellente"
            : stat.efficiency === "good"
            ? "Bonne"
            : stat.efficiency === "average"
            ? "Moyenne"
            : "Faible",
      }));

      exportToCSV(
        exportData,
        [
          { key: "vehicule", label: "Véhicule" },
          { key: "coutTotal", label: "Coût Total" },
          { key: "litresTotal", label: "Litres Total" },
          { key: "nombrePleins", label: "Nombre de pleins" },
          { key: "consommation", label: "Consommation" },
          { key: "efficacite", label: "Efficacité" },
        ],
        "analyse_carburant_vehicules"
      );
    } else if (viewMode === "monthly") {
      const exportData = monthlyData.map((stat) => ({
        mois: stat.month,
        coutTotal: formatAmountForExport(stat.cost),
        litresTotal: `${stat.liters.toFixed(2)} L`,
        nombrePleins: stat.count,
        coutMoyen: formatAmountForExport(stat.cost / stat.count),
      }));

      exportToCSV(
        exportData,
        [
          { key: "mois", label: "Mois" },
          { key: "coutTotal", label: "Coût Total" },
          { key: "litresTotal", label: "Litres Total" },
          { key: "nombrePleins", label: "Nombre de pleins" },
          { key: "coutMoyen", label: "Coût Moyen" },
        ],
        "analyse_carburant_mensuelle"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analyse de Carburant
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Statistiques détaillées et analyse de consommation
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Fuel className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-900">Coût Total</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {totalCost.toFixed(2)} TND
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {mockFuelRecords.length} pleins enregistrés
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Gauge className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-green-900">Litres Total</p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {totalLiters.toFixed(2)} L
          </p>
          <p className="text-xs text-green-600 mt-1">Consommés par la flotte</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-sm font-medium text-yellow-900">
            Prix Moyen/Litre
          </p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">
            {averagePricePerLiter.toFixed(2)} TND
          </p>
          <p className="text-xs text-yellow-600 mt-1">Sur tous les pleins</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-purple-900">
            Coût Mensuel Moy.
          </p>
          <p className="text-3xl font-bold text-purple-700 mt-2">
            {monthlyData.length > 0
              ? (totalCost / monthlyData.length).toFixed(2)
              : "0.00"}{" "}
            TND
          </p>
          <p className="text-xs text-purple-600 mt-1">Dépense moyenne</p>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("overview")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "overview"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "monthly"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Par Mois
          </button>
          <button
            onClick={() => setViewMode("vehicle")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "vehicle"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Par Véhicule
          </button>
        </div>
      </div>

      {/* Contenu selon le mode */}
      {viewMode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Types de carburant */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Fuel className="h-5 w-5 mr-2 text-primary-600" />
              Répartition par Type de Carburant
            </h3>
            <div className="space-y-4">
              {Object.entries(fuelTypeStats).map(([type, stats]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 capitalize">
                      {type === "diesel"
                        ? "Diesel"
                        : type === "gasoline"
                        ? "Essence"
                        : "Électrique"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.count} pleins
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        type === "diesel"
                          ? "bg-blue-600"
                          : type === "gasoline"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                      style={{
                        width: `${(stats.cost / totalCost) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{stats.liters.toFixed(2)} L</span>
                    <span>{stats.cost.toFixed(2)} TND</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stations les plus utilisées */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Stations les Plus Utilisées
            </h3>
            <div className="space-y-3">
              {Object.entries(stationStats)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5)
                .map(([station, stats]) => (
                  <div
                    key={station}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{station}</p>
                      <p className="text-sm text-gray-600">
                        {stats.liters.toFixed(2)} L · {stats.count} pleins
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {stats.cost.toFixed(2)} TND
                      </p>
                      <p className="text-xs text-gray-500">
                        {(stats.cost / stats.liters).toFixed(2)} TND/L
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === "monthly" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              Évolution Mensuelle
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre de Pleins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Litres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût Moyen/Plein
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix/Litre
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.map((stat) => (
                  <tr key={stat.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(stat.month + "-01").toLocaleDateString(
                        "fr-TN",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.liters.toFixed(2)} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {stat.cost.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(stat.cost / stat.count).toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(stat.cost / stat.liters).toFixed(2)} TND/L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "vehicle" && (
        <div className="space-y-4">
          {vehicleStats.map((stat) => (
            <div
              key={stat.vehicle.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stat.vehicle.brand} {stat.vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stat.vehicle.plateNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {stat.efficiency === "excellent" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Excellente
                    </span>
                  )}
                  {stat.efficiency === "good" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Bonne
                    </span>
                  )}
                  {stat.efficiency === "average" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Moyenne
                    </span>
                  )}
                  {stat.efficiency === "poor" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Faible
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Pleins</p>
                  <p className="text-xl font-bold text-blue-900">
                    {stat.recordCount}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Litres</p>
                  <p className="text-xl font-bold text-green-900">
                    {stat.totalLiters.toFixed(0)} L
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-600 font-medium">
                    Coût Total
                  </p>
                  <p className="text-xl font-bold text-yellow-900">
                    {stat.totalCost.toFixed(0)} TND
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">
                    Consommation
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    {stat.consumption > 0 ? stat.consumption.toFixed(1) : "N/A"}
                    {stat.consumption > 0 && (
                      <span className="text-sm"> L/100km</span>
                    )}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">Coût/Plein</p>
                  <p className="text-xl font-bold text-red-900">
                    {(stat.totalCost / stat.recordCount).toFixed(0)} TND
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FuelStatistics;
