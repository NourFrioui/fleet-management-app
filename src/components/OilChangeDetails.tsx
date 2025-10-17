import React from "react";
import { Link } from "react-router-dom";
import {
  Droplets,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  FileText,
  Edit,
  ArrowLeft,
} from "lucide-react";
import type { OilChange } from "../types";
import { OIL_TYPES } from "../utils/vehicleConstants";

interface OilChangeDetailsProps {
  oilChange: OilChange;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkCompleted?: () => void;
}

const OilChangeDetails: React.FC<OilChangeDetailsProps> = ({
  oilChange,
  onEdit,
  onDelete,
  onMarkCompleted,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "scheduled":
        return <Calendar className="h-6 w-6 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminée";
      case "in_progress":
        return "En cours";
      case "scheduled":
        return "Programmée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOilTypeText = (oilType: string) => {
    const oilTypeData = OIL_TYPES.find((type) => type.value === oilType);
    return oilTypeData ? oilTypeData.label : oilType;
  };

  const getOilTypeColor = (oilType: string) => {
    const oilTypeData = OIL_TYPES.find((type) => type.value === oilType);
    return oilTypeData
      ? `bg-${oilTypeData.color}-100 text-${oilTypeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/oil-change"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="bg-primary-600 p-2 rounded-full mr-4">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Vidange - Véhicule {oilChange.vehicleId}
                </h1>
                <p className="text-sm text-gray-500">Vidange #{oilChange.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOilTypeColor(
                  oilChange.oilType
                )}`}
              >
                {getOilTypeText(oilChange.oilType)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  oilChange.status
                )}`}
              >
                {getStatusIcon(oilChange.status)}
                <span className="ml-1">{getStatusText(oilChange.status)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Détails de la vidange */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Détails de la vidange
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Véhicule
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {oilChange.vehicleId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Kilométrage
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {oilChange.mileage.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date programmée
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(oilChange.scheduledDate).toLocaleDateString()}
                      </dd>
                    </div>
                    {oilChange.completedDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date de fin
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            oilChange.completedDate
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {oilChange.cost && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Coût
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {oilChange.cost}TND
                        </dd>
                      </div>
                    )}
                    {oilChange.nextOilChangeMileage && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Prochaine vidange (km)
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {oilChange.nextOilChangeMileage.toLocaleString()} km
                        </dd>
                      </div>
                    )}
                    {oilChange.nextOilChangeDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date estimée prochaine vidange
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            oilChange.nextOilChangeDate
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Informations sur l'huile */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informations sur l'huile
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Type d'huile
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {getOilTypeText(oilChange.oilType)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Quantité
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {oilChange.oilQuantity}L
                      </dd>
                    </div>
                    {oilChange.oilBrand && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Marque d'huile
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {oilChange.oilBrand}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Filtre changé
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {oilChange.filterChanged ? "Oui" : "Non"}
                      </dd>
                    </div>
                    {oilChange.filterChanged && oilChange.filterBrand && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Marque du filtre
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {oilChange.filterBrand}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Notes */}
              {oilChange.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notes
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {oilChange.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations secondaires */}
            <div className="space-y-6">
              {/* Informations techniques */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informations techniques
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {oilChange.technician && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Technicien
                        </p>
                        <p className="text-sm text-gray-500">
                          {oilChange.technician}
                        </p>
                      </div>
                    </div>
                  )}
                  {oilChange.serviceCenter && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Centre de service
                        </p>
                        <p className="text-sm text-gray-500">
                          {oilChange.serviceCenter}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  )}
                  {oilChange.status === "scheduled" && onMarkCompleted && (
                    <button
                      onClick={onMarkCompleted}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme terminée
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>

              {/* Métadonnées */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Métadonnées
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Créé le
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(oilChange.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Modifié le
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(oilChange.updatedAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilChangeDetails;
