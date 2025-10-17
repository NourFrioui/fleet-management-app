import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Disc,
  FileText,
} from "lucide-react";

const TireChangeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const tireChange = {
    id: "1",
    vehicleId: "1",
    vehicle: {
      plateNumber: "123 TUN 4567",
      brand: "Renault",
      model: "Clio",
    },
    position: "AVD",
    tireBrand: "Michelin",
    tireModel: "Primacy 4",
    tireSize: "205/55R16",
    mileage: 45000,
    cost: 180,
    date: "2024-03-15",
    serviceCenter: "Garage Auto Tunis",
    technician: "Mohamed Trabelsi",
    notes: "Usure normale, pneu avant droit remplacé",
  };

  const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
      AVD: "Avant Droit",
      AVG: "Avant Gauche",
      ARD: "Arrière Droit",
      ARG: "Arrière Gauche",
    };
    return labels[position] || position;
  };

  const getPositionColor = (position: string): string => {
    const colors: Record<string, string> = {
      AVD: "bg-blue-100 text-blue-800",
      AVG: "bg-green-100 text-green-800",
      ARD: "bg-orange-100 text-orange-800",
      ARG: "bg-purple-100 text-purple-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce changement de pneu ?"
      )
    ) {
      // Logique de suppression
      navigate("/tire-change");
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/tire-change")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Détails du changement de pneu
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {tireChange.vehicle.brand} {tireChange.vehicle.model} -{" "}
              {tireChange.vehicle.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/tire-change/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Informations du pneu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Position</p>
            <span
              className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(
                tireChange.position
              )}`}
            >
              {getPositionLabel(tireChange.position)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Marque</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {tireChange.tireBrand}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Modèle</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {tireChange.tireModel}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Taille</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {tireChange.tireSize}
            </p>
          </div>
        </div>
      </div>

      {/* Détails financiers et techniques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-900">Date</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {new Date(tireChange.date).toLocaleDateString("fr-TN")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <Disc className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-green-900">Kilométrage</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {tireChange.mileage.toLocaleString()} km
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-sm font-medium text-yellow-900">Coût</p>
          <p className="text-2xl font-bold text-yellow-700 mt-2">
            {tireChange.cost.toFixed(2)} TND
          </p>
        </div>
      </div>

      {/* Informations du service */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Informations du service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tireChange.serviceCenter && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Centre de service
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {tireChange.serviceCenter}
                </p>
              </div>
            </div>
          )}
          {tireChange.technician && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Technicien</p>
                <p className="mt-1 text-sm text-gray-900">
                  {tireChange.technician}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {tireChange.notes && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {tireChange.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TireChangeDetails;
