import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Fuel,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import type { FuelConsumption, FuelFilters } from "../types";
import { mockFuelRecords } from "../data/mockData";

const FuelPage: React.FC = () => {
  const [fuelRecords, setFuelRecords] = useState<FuelConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FuelFilters>({});

  useEffect(() => {
    const fetchFuelRecords = async () => {
      try {
        // En production, remplacer par : const response = await fuelService.getAll(filters);
        setFuelRecords(mockFuelRecords);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des enregistrements de carburant:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFuelRecords();
  }, [filters]);

  const filteredFuelRecords = fuelRecords.filter((record) => {
    const matchesSearch =
      record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.station?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fuelCardNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle =
      !filters.vehicleId || record.vehicleId === filters.vehicleId;
    const matchesFuelType =
      !filters.fuelType || record.fuelType === filters.fuelType;
    const matchesDateFrom =
      !filters.dateFrom || new Date(record.date) >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || new Date(record.date) <= new Date(filters.dateTo);

    return (
      matchesSearch &&
      matchesVehicle &&
      matchesFuelType &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const getFuelTypeText = (type: string) => {
    switch (type) {
      case "gasoline":
        return "Essence";
      case "diesel":
        return "Diesel";
      case "electric":
        return "Électrique";
      default:
        return type;
    }
  };

  const getFuelTypeColor = (type: string) => {
    switch (type) {
      case "gasoline":
        return "bg-green-100 text-green-800";
      case "diesel":
        return "bg-blue-100 text-blue-800";
      case "electric":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateConsumption = (record: FuelConsumption) => {
    // Calcul simplifié de la consommation (L/100km)
    // Dans une vraie application, il faudrait calculer avec le kilométrage précédent
    return (record.quantity / 500) * 100; // Approximation
  };

  const totalCost = filteredFuelRecords.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const totalQuantity = filteredFuelRecords.reduce(
    (sum, record) => sum + record.quantity,
    0
  );
  const averageCostPerLiter = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet enregistrement de carburant ?"
      )
    ) {
      try {
        // await fuelService.delete(id);
        setFuelRecords(fuelRecords.filter((r) => r.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-900">Carburant</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et suivi de la consommation de carburant
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/fuel/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel enregistrement
          </Link>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Coût Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalCost.toFixed(2)} TND
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Fuel className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Quantité Totale
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalQuantity.toFixed(1)} L
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Prix Moyen/Litre
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {averageCostPerLiter.toFixed(2)} TND
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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
                placeholder="Véhicule, station, carte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre véhicule */}
          <div>
            <label
              htmlFor="vehicle"
              className="block text-sm font-medium text-gray-700"
            >
              Véhicule
            </label>
            <select
              id="vehicle"
              name="vehicle"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.vehicleId || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  vehicleId: e.target.value || undefined,
                })
              }
            >
              <option value="">Tous les véhicules</option>
              <option value="1">AB-123-CD</option>
              <option value="2">EF-456-GH</option>
              <option value="3">IJ-789-KL</option>
            </select>
          </div>

          {/* Filtre type de carburant */}
          <div>
            <label
              htmlFor="fuelType"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.fuelType || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fuelType: e.target.value || undefined,
                })
              }
            >
              <option value="">Tous les types</option>
              <option value="gasoline">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Électrique</option>
            </select>
          </div>

          {/* Filtre date */}
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateFrom: e.target.value || undefined,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Liste des enregistrements */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredFuelRecords.map((record) => (
            <li key={record.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-600 p-2 rounded-full">
                        <Fuel className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          Véhicule {record.vehicleId}
                        </p>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFuelTypeColor(
                            record.fuelType
                          )}`}
                        >
                          {getFuelTypeText(record.fuelType)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Fuel className="h-4 w-4 mr-1" />
                          <span>{record.quantity}L</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{record.cost.toFixed(2)}TND</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>{record.mileage.toLocaleString()} km</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        {record.station && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{record.station}</span>
                          </>
                        )}
                        {record.fuelCardNumber && (
                          <>
                            <span className="mx-2">•</span>
                            <CreditCard className="h-4 w-4 mr-1" />
                            <span>{record.fuelCardNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {(record.cost / record.quantity).toFixed(2)}TND/L
                      </div>
                      <div className="text-xs text-gray-500">
                        {calculateConsumption(record).toFixed(1)}L/100km
                      </div>
                    </div>
                    <Link
                      to={`/fuel/${record.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/fuel/${record.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {record.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {record.notes}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {filteredFuelRecords.length === 0 && (
          <div className="text-center py-12">
            <Fuel className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun enregistrement trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter un nouvel enregistrement de carburant."}
            </p>
            {!searchTerm && !Object.values(filters).some((f) => f) && (
              <div className="mt-6">
                <Link
                  to="/fuel/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel enregistrement
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelPage;
