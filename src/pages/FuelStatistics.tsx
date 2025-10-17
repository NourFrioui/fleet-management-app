import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Fuel,
  Car,
  BarChart3,
  Download,
} from "lucide-react";
import type { FuelConsumption, Vehicle } from "../types";

const FuelStatistics: React.FC = () => {
  const [viewMode, setViewMode] = useState<
    "daily" | "monthly" | "vehicle" | "kilometrage"
  >("daily");

  // Mock data
  const mockFuelConsumptions: FuelConsumption[] = [
    {
      id: "1",
      vehicleId: "1",
      date: "2024-03-20",
      fuelType: "gasoline",
      quantity: 45.5,
      cost: 95.55,
      mileage: 48500,
      station: "Station Total Tunis Centre",
      createdAt: "2024-03-20T00:00:00Z",
      updatedAt: "2024-03-20T00:00:00Z",
    },
    {
      id: "2",
      vehicleId: "2",
      date: "2024-03-18",
      fuelType: "diesel",
      quantity: 50.0,
      cost: 90.0,
      mileage: 52000,
      station: "Agil Sfax",
      createdAt: "2024-03-18T00:00:00Z",
      updatedAt: "2024-03-18T00:00:00Z",
    },
    {
      id: "3",
      vehicleId: "1",
      date: "2024-03-15",
      fuelType: "gasoline",
      quantity: 40.0,
      cost: 84.0,
      mileage: 48200,
      station: "Station Total Tunis Centre",
      createdAt: "2024-03-15T00:00:00Z",
      updatedAt: "2024-03-15T00:00:00Z",
    },
    {
      id: "4",
      vehicleId: "3",
      date: "2024-03-12",
      fuelType: "gasoline",
      quantity: 38.0,
      cost: 79.8,
      mileage: 35600,
      station: "Oilibya Sousse",
      createdAt: "2024-03-12T00:00:00Z",
      updatedAt: "2024-03-12T00:00:00Z",
    },
    {
      id: "5",
      vehicleId: "2",
      date: "2024-03-10",
      fuelType: "diesel",
      quantity: 48.0,
      cost: 86.4,
      mileage: 51500,
      station: "Agil Sfax",
      createdAt: "2024-03-10T00:00:00Z",
      updatedAt: "2024-03-10T00:00:00Z",
    },
    {
      id: "6",
      vehicleId: "1",
      date: "2024-02-28",
      fuelType: "gasoline",
      quantity: 42.0,
      cost: 88.2,
      mileage: 47800,
      station: "Station Total Tunis Centre",
      createdAt: "2024-02-28T00:00:00Z",
      updatedAt: "2024-02-28T00:00:00Z",
    },
  ];

  const mockVehicles: Vehicle[] = [
    {
      id: "1",
      plateNumber: "123 TUN 4567",
      brand: "Renault",
      model: "Clio",
      year: 2020,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 48500,
      fuelType: "gasoline",
      color: "Bleu",
      purchaseDate: "2020-01-15",
      lastMaintenanceDate: "2024-02-20",
      nextMaintenanceDate: "2024-08-20",
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2024-02-20T00:00:00Z",
    },
    {
      id: "2",
      plateNumber: "456 TUN 7890",
      brand: "Peugeot",
      model: "208",
      year: 2021,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 52500,
      fuelType: "diesel",
      color: "Blanc",
      purchaseDate: "2021-03-10",
      lastMaintenanceDate: "2024-03-10",
      nextMaintenanceDate: "2024-09-10",
      createdAt: "2021-03-10T00:00:00Z",
      updatedAt: "2024-03-10T00:00:00Z",
    },
    {
      id: "3",
      plateNumber: "789 TUN 1234",
      brand: "Volkswagen",
      model: "Polo",
      year: 2019,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 35600,
      fuelType: "gasoline",
      color: "Noir",
      purchaseDate: "2019-06-01",
      lastMaintenanceDate: "2024-03-12",
      nextMaintenanceDate: "2024-09-12",
      createdAt: "2019-06-01T00:00:00Z",
      updatedAt: "2024-03-12T00:00:00Z",
    },
  ];

  // Calculer les statistiques par jour
  const dailyStats = () => {
    const grouped = mockFuelConsumptions.reduce((acc, fuel) => {
      const date = fuel.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          totalLiters: 0,
          totalCost: 0,
          count: 0,
          vehicles: new Set(),
        };
      }
      acc[date].totalLiters += fuel.quantity;
      acc[date].totalCost += fuel.cost;
      acc[date].count += 1;
      acc[date].vehicles.add(fuel.vehicleId);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((day: any) => ({
        ...day,
        vehicleCount: day.vehicles.size,
        averageCost: day.totalCost / day.count,
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  };

  // Calculer les statistiques par mois
  const monthlyStats = () => {
    const grouped = mockFuelConsumptions.reduce((acc, fuel) => {
      const month = fuel.date.slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month,
          totalLiters: 0,
          totalCost: 0,
          count: 0,
          vehicles: new Set(),
        };
      }
      acc[month].totalLiters += fuel.quantity;
      acc[month].totalCost += fuel.cost;
      acc[month].count += 1;
      acc[month].vehicles.add(fuel.vehicleId);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((month: any) => ({
        ...month,
        vehicleCount: month.vehicles.size,
        averageCost: month.totalCost / month.count,
      }))
      .sort((a: any, b: any) => b.month.localeCompare(a.month));
  };

  // Calculer les statistiques par véhicule
  const vehicleStats = () => {
    const grouped = mockFuelConsumptions.reduce((acc, fuel) => {
      const vehicleId = fuel.vehicleId;
      if (!acc[vehicleId]) {
        acc[vehicleId] = {
          vehicleId,
          totalLiters: 0,
          totalCost: 0,
          count: 0,
          mileageStart: Infinity,
          mileageEnd: 0,
        };
      }
      acc[vehicleId].totalLiters += fuel.quantity;
      acc[vehicleId].totalCost += fuel.cost;
      acc[vehicleId].count += 1;
      acc[vehicleId].mileageStart = Math.min(
        acc[vehicleId].mileageStart,
        fuel.mileage
      );
      acc[vehicleId].mileageEnd = Math.max(
        acc[vehicleId].mileageEnd,
        fuel.mileage
      );
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((vehicle: any) => {
      const vehicleInfo = mockVehicles.find((v) => v.id === vehicle.vehicleId);
      const totalKilometers = vehicle.mileageEnd - vehicle.mileageStart;
      const averageConsumption =
        totalKilometers > 0 ? (vehicle.totalLiters / totalKilometers) * 100 : 0;

      let efficiency: "excellent" | "good" | "average" | "poor" = "average";
      if (averageConsumption < 5) efficiency = "excellent";
      else if (averageConsumption < 7) efficiency = "good";
      else if (averageConsumption < 9) efficiency = "average";
      else efficiency = "poor";

      return {
        ...vehicle,
        vehicleName: vehicleInfo
          ? `${vehicleInfo.brand} ${vehicleInfo.model} - ${vehicleInfo.plateNumber}`
          : "Véhicule inconnu",
        totalKilometers,
        averageConsumption,
        efficiency,
        averageCost: vehicle.totalCost / vehicle.count,
      };
    });
  };

  // Calculer les statistiques par plage de kilométrage
  const kilometrageStats = () => {
    const ranges = [
      { label: "0-10,000 km", min: 0, max: 10000 },
      { label: "10,000-30,000 km", min: 10000, max: 30000 },
      { label: "30,000-50,000 km", min: 30000, max: 50000 },
      { label: "50,000-70,000 km", min: 50000, max: 70000 },
      { label: "70,000+ km", min: 70000, max: Infinity },
    ];

    return ranges.map((range) => {
      const fuels = mockFuelConsumptions.filter(
        (f) => f.mileage >= range.min && f.mileage < range.max
      );

      const totalLiters = fuels.reduce((sum, f) => sum + f.quantity, 0);
      const totalCost = fuels.reduce((sum, f) => sum + f.cost, 0);
      const averageConsumption =
        fuels.length > 0 ? totalLiters / fuels.length : 0;

      return {
        range: range.label,
        totalLiters,
        totalCost,
        averageConsumption,
        count: fuels.length,
      };
    });
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyLabel = (efficiency: string) => {
    switch (efficiency) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Bon";
      case "average":
        return "Moyen";
      case "poor":
        return "Élevé";
      default:
        return efficiency;
    }
  };

  const handleExport = () => {
    console.log("Export statistics");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Statistiques de Consommation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analysez la consommation de carburant de votre flotte
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consommations</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockFuelConsumptions.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Fuel className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Litres Totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockFuelConsumptions
                  .reduce((sum, f) => sum + f.quantity, 0)
                  .toFixed(1)}{" "}
                L
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockFuelConsumptions
                  .reduce((sum, f) => sum + f.cost, 0)
                  .toFixed(2)}{" "}
                TND
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Véhicules</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(mockFuelConsumptions.map((f) => f.vehicleId)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Car className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets de visualisation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setViewMode("daily")}
              className={`${
                viewMode === "daily"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Calendar className="inline h-5 w-5 mr-2" />
              Par Jour
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`${
                viewMode === "monthly"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <BarChart3 className="inline h-5 w-5 mr-2" />
              Par Mois
            </button>
            <button
              onClick={() => setViewMode("vehicle")}
              className={`${
                viewMode === "vehicle"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Car className="inline h-5 w-5 mr-2" />
              Par Véhicule
            </button>
            <button
              onClick={() => setViewMode("kilometrage")}
              className={`${
                viewMode === "kilometrage"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <TrendingUp className="inline h-5 w-5 mr-2" />
              Par Kilométrage
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Vue par jour */}
          {viewMode === "daily" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consommation quotidienne
              </h3>
              <div className="grid gap-4">
                {dailyStats().map((day: any) => (
                  <div
                    key={day.date}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString("fr-TN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {day.vehicleCount} véhicule(s) • {day.count}{" "}
                          ravitaillement(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {day.totalLiters.toFixed(1)} L
                        </p>
                        <p className="text-sm text-gray-600">
                          {day.totalCost.toFixed(2)} TND
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vue par mois */}
          {viewMode === "monthly" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consommation mensuelle
              </h3>
              <div className="grid gap-4">
                {monthlyStats().map((month: any) => (
                  <div
                    key={month.month}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(month.month + "-01").toLocaleDateString(
                            "fr-TN",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {month.vehicleCount} véhicule(s) • {month.count}{" "}
                          ravitaillement(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {month.totalLiters.toFixed(1)} L
                        </p>
                        <p className="text-sm text-gray-600">
                          {month.totalCost.toFixed(2)} TND
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Moy: {month.averageCost.toFixed(2)} TND/ravit.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vue par véhicule */}
          {viewMode === "vehicle" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consommation par véhicule
              </h3>
              <div className="grid gap-4">
                {vehicleStats().map((vehicle: any) => (
                  <div
                    key={vehicle.vehicleId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {vehicle.vehicleName}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Litres totaux
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehicle.totalLiters.toFixed(1)} L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Coût total</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehicle.totalCost.toFixed(2)} TND
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Kilomètres parcourus
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehicle.totalKilometers.toLocaleString()} km
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Consommation moyenne
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehicle.averageConsumption.toFixed(2)} L/100km
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEfficiencyColor(
                            vehicle.efficiency
                          )}`}
                        >
                          {getEfficiencyLabel(vehicle.efficiency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vue par kilométrage */}
          {viewMode === "kilometrage" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consommation par plage de kilométrage
              </h3>
              <div className="grid gap-4">
                {kilometrageStats().map((range: any) => (
                  <div
                    key={range.range}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {range.range}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {range.count} ravitaillement(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {range.totalLiters.toFixed(1)} L
                        </p>
                        <p className="text-sm text-gray-600">
                          {range.totalCost.toFixed(2)} TND
                        </p>
                        {range.count > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Moy: {range.averageConsumption.toFixed(2)} L/ravit.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelStatistics;
