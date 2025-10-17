import React from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  AlertTriangle,
  FileText,
  Edit,
  ArrowLeft,
} from "lucide-react";
import type { Maintenance } from "../types";
import {
  MAINTENANCE_TYPES,
  MAINTENANCE_PRIORITIES,
} from "../utils/vehicleConstants";

interface MaintenanceDetailsProps {
  maintenance: Maintenance;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkCompleted?: () => void;
}

const MaintenanceDetails: React.FC<MaintenanceDetailsProps> = ({
  maintenance,
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

  const getTypeText = (type: string) => {
    const typeData = MAINTENANCE_TYPES.find((t) => t.value === type);
    return typeData ? typeData.label : type;
  };

  const getTypeColor = (type: string) => {
    const typeData = MAINTENANCE_TYPES.find((t) => t.value === type);
    return typeData
      ? `bg-${typeData.color}-100 text-${typeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const getPriorityText = (priority: string) => {
    const priorityData = MAINTENANCE_PRIORITIES.find(
      (p) => p.value === priority
    );
    return priorityData ? priorityData.label : priority;
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = MAINTENANCE_PRIORITIES.find(
      (p) => p.value === priority
    );
    return priorityData
      ? `bg-${priorityData.color}-100 text-${priorityData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent" || priority === "high") {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/maintenance"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="bg-primary-600 p-2 rounded-full mr-4">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {maintenance.description}
                </h1>
                <p className="text-sm text-gray-500">
                  Maintenance #{maintenance.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  maintenance.type
                )}`}
              >
                {getTypeText(maintenance.type)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  maintenance.status
                )}`}
              >
                {getStatusIcon(maintenance.status)}
                <span className="ml-1">
                  {getStatusText(maintenance.status)}
                </span>
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                  maintenance.priority
                )}`}
              >
                {getPriorityIcon(maintenance.priority)}
                <span className="ml-1">
                  {getPriorityText(maintenance.priority)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Détails de la maintenance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Détails de la maintenance
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Véhicule
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {maintenance.vehicleId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Kilométrage
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {maintenance.mileage.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date programmée
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(
                          maintenance.scheduledDate
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                    {maintenance.completedDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date de fin
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            maintenance.completedDate
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {maintenance.cost && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Coût
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {maintenance.cost}€
                        </dd>
                      </div>
                    )}
                    {maintenance.laborHours && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Heures de main-d'œuvre
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {maintenance.laborHours}h
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Pièces utilisées */}
              {maintenance.parts && maintenance.parts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Pièces utilisées
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pièce
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Référence
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prix unitaire
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {maintenance.parts.map((part) => (
                            <tr key={part.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {part.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.partNumber || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.unitPrice}€
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(part.quantity * part.unitPrice).toFixed(2)}€
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {maintenance.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notes
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {maintenance.notes}
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
                  {maintenance.technician && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Technicien
                        </p>
                        <p className="text-sm text-gray-500">
                          {maintenance.technician}
                        </p>
                      </div>
                    </div>
                  )}
                  {maintenance.serviceCenter && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Centre de service
                        </p>
                        <p className="text-sm text-gray-500">
                          {maintenance.serviceCenter}
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
                  {maintenance.status === "scheduled" && onMarkCompleted && (
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
                        {new Date(maintenance.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Modifié le
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(maintenance.updatedAt).toLocaleDateString()}
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

export default MaintenanceDetails;
