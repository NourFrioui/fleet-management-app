import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  Droplet,
  FileText,
  Disc,
} from "lucide-react";

const WashingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const washing = {
    id: "1",
    vehicleId: "1",
    vehicle: {
      plateNumber: "123 TUN 4567",
      brand: "Renault",
      model: "Clio",
    },
    type: "complete",
    cost: 25,
    date: "2024-03-20",
    location: "Station Lavage Tunis Centre",
    mileage: 48500,
    notes: "Lavage complet intérieur et extérieur",
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      exterior: "Extérieur",
      interior: "Intérieur",
      complete: "Complet",
      express: "Express",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      exterior: "bg-blue-100 text-blue-800",
      interior: "bg-green-100 text-green-800",
      complete: "bg-purple-100 text-purple-800",
      express: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lavage ?")) {
      // Logique de suppression
      navigate("/washing");
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/washing")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Détails du lavage
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {washing.vehicle.brand} {washing.vehicle.model} -{" "}
              {washing.vehicle.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/washing/${id}/edit`}
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
          Type de lavage
        </h2>
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getTypeColor(
            washing.type
          )}`}
        >
          <Droplet className="h-5 w-5 mr-2" />
          {getTypeLabel(washing.type)}
        </span>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-900">Date</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {new Date(washing.date).toLocaleDateString("fr-TN")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-green-900">Coût</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {washing.cost.toFixed(2)} TND
          </p>
        </div>

        {washing.mileage && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <Disc className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-purple-900">Kilométrage</p>
            <p className="text-2xl font-bold text-purple-700 mt-2">
              {washing.mileage.toLocaleString()} km
            </p>
          </div>
        )}
      </div>

      {/* Lieu */}
      {washing.location && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Lieu du lavage
              </h2>
              <p className="text-sm text-gray-600">{washing.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {washing.notes && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {washing.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WashingDetails;
