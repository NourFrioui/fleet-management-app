import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Fuel,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  TrendingUp,
  FileText,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { mockFuelRecords, mockVehicles } from "../data/mockData";
import type { FuelConsumption, Vehicle } from "../types";

const FuelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fuelRecord, setFuelRecord] = useState<FuelConsumption | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuelDetails = async () => {
      try {
        // En production, remplacer par : const response = await fuelService.getById(id);
        const foundRecord = mockFuelRecords.find((record) => record.id === id);

        if (foundRecord) {
          setFuelRecord(foundRecord);

          // Trouver le véhicule associé
          const associatedVehicle = mockVehicles.find(
            (v) => v.id === foundRecord.vehicleId
          );
          setVehicle(associatedVehicle || null);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails du carburant:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFuelDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet enregistrement de carburant ?"
      )
    ) {
      try {
        // await fuelService.delete(id);
        navigate("/fuel");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

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

  const calculateConsumption = () => {
    if (!fuelRecord) return 0;
    // Calcul simplifié (L/100km) - Dans une vraie application, calculer avec le kilométrage précédent
    return (fuelRecord.quantity / 500) * 100; // Approximation
  };

  const getPricePerLiter = () => {
    if (!fuelRecord) return 0;
    return fuelRecord.cost / fuelRecord.quantity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!fuelRecord) {
    return (
      <div className="text-center py-12">
        <Fuel className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Enregistrement non trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          L'enregistrement de carburant que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link
            to="/fuel"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au carburant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/fuel" className="text-gray-400 hover:text-gray-600 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Enregistrement de carburant #{fuelRecord.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(fuelRecord.date).toLocaleDateString()} -{" "}
              {fuelRecord.station || "Station non spécifiée"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFuelTypeColor(
              fuelRecord.fuelType
            )}`}
          >
            {getFuelTypeText(fuelRecord.fuelType)}
          </span>
          <Link
            to={`/fuel/${fuelRecord.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Fuel className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Quantité
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {fuelRecord.quantity} L
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
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Coût Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {fuelRecord.cost.toFixed(2)} TND
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
                    Prix/Litre
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {getPricePerLiter().toFixed(2)} TND
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
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Consommation
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {calculateConsumption().toFixed(1)} L/100km
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Détails du ravitaillement */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Détails du ravitaillement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(fuelRecord.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Kilométrage
                  </p>
                  <p className="text-sm text-gray-900">
                    {fuelRecord.mileage.toLocaleString()} km
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Type de carburant
                  </p>
                  <p className="text-sm text-gray-900">
                    {getFuelTypeText(fuelRecord.fuelType)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Station</p>
                  <p className="text-sm text-gray-900">
                    {fuelRecord.station || "Non spécifiée"}
                  </p>
                </div>
              </div>
              {fuelRecord.fuelCardNumber && (
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Carte carburant
                    </p>
                    <p className="text-sm text-gray-900">
                      {fuelRecord.fuelCardNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations financières */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations financières
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Fuel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Quantité</p>
                <p className="text-2xl font-bold text-blue-600">
                  {fuelRecord.quantity}L
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Coût total</p>
                <p className="text-2xl font-bold text-green-600">
                  {fuelRecord.cost.toFixed(2)}TND
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Prix/Litre</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getPricePerLiter().toFixed(2)}TND
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {fuelRecord.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {fuelRecord.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Véhicule associé */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Véhicule</h3>
            {vehicle ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Immatriculation
                  </span>
                  <span className="text-sm text-gray-900">
                    {vehicle.plateNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Marque/Modèle
                  </span>
                  <span className="text-sm text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Année
                  </span>
                  <span className="text-sm text-gray-900">{vehicle.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Type de carburant
                  </span>
                  <span className="text-sm text-gray-900">
                    {vehicle.fuelType === "diesel"
                      ? "Diesel"
                      : vehicle.fuelType === "gasoline"
                      ? "Essence"
                      : vehicle.fuelType === "electric"
                      ? "Électrique"
                      : vehicle.fuelType}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    Voir les détails du véhicule →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Véhicule non trouvé</p>
            )}
          </div>

          {/* Informations de consommation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Consommation
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Consommation estimée
                </span>
                <span className="text-sm text-gray-900">
                  {calculateConsumption().toFixed(1)} L/100km
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Kilométrage
                </span>
                <span className="text-sm text-gray-900">
                  {fuelRecord.mileage.toLocaleString()} km
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Type de carburant
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFuelTypeColor(
                    fuelRecord.fuelType
                  )}`}
                >
                  {getFuelTypeText(fuelRecord.fuelType)}
                </span>
              </div>
            </div>
          </div>

          {/* Dates importantes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dates importantes
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date de ravitaillement
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(fuelRecord.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Créé le</p>
                <p className="text-sm text-gray-900">
                  {new Date(fuelRecord.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modifié le</p>
                <p className="text-sm text-gray-900">
                  {new Date(fuelRecord.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelDetails;
