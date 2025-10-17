import React from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  Phone,
  FileText,
  Edit,
  ArrowLeft,
} from "lucide-react";
import type { TechnicalInspection } from "../types";
import {
  INSPECTION_TYPES,
  DEFECT_CATEGORIES,
  DEFECT_SEVERITY,
} from "../utils/vehicleConstants";

interface TechnicalInspectionDetailsProps {
  inspection: TechnicalInspection;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TechnicalInspectionDetails: React.FC<TechnicalInspectionDetailsProps> = ({
  inspection,
  onEdit,
  onDelete,
}) => {
  const getResultIcon = (result: string) => {
    switch (result) {
      case "favorable":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "favorable_with_restrictions":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "unfavorable":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "favorable":
        return "Favorable";
      case "favorable_with_restrictions":
        return "Favorable avec restrictions";
      case "unfavorable":
        return "Défavorable";
      default:
        return result;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "favorable":
        return "bg-green-100 text-green-800";
      case "favorable_with_restrictions":
        return "bg-yellow-100 text-yellow-800";
      case "unfavorable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    const typeData = INSPECTION_TYPES.find((t) => t.value === type);
    return typeData ? typeData.label : type;
  };

  const getTypeColor = (type: string) => {
    const typeData = INSPECTION_TYPES.find((t) => t.value === type);
    return typeData
      ? `bg-${typeData.color}-100 text-${typeData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const getCategoryText = (category: string) => {
    const categoryData = DEFECT_CATEGORIES.find((c) => c.value === category);
    return categoryData ? categoryData.label : category;
  };

  const getSeverityText = (severity: string) => {
    const severityData = DEFECT_SEVERITY.find((s) => s.value === severity);
    return severityData ? severityData.label : severity;
  };

  const getSeverityColor = (severity: string) => {
    const severityData = DEFECT_SEVERITY.find((s) => s.value === severity);
    return severityData
      ? `bg-${severityData.color}-100 text-${severityData.color}-800`
      : "bg-gray-100 text-gray-800";
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/technical-inspection"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="bg-primary-600 p-2 rounded-full mr-4">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Visite technique - Véhicule {inspection.vehicleId}
                </h1>
                <p className="text-sm text-gray-500">
                  Visite technique #{inspection.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  inspection.inspectionType
                )}`}
              >
                {getTypeText(inspection.inspectionType)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultColor(
                  inspection.result
                )}`}
              >
                {getResultIcon(inspection.result)}
                <span className="ml-1">{getResultText(inspection.result)}</span>
              </span>
              {isExpired(inspection.expiryDate) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Expiré
                </span>
              )}
              {isExpiringSoon(inspection.expiryDate) &&
                !isExpired(inspection.expiryDate) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Expire bientôt
                  </span>
                )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Détails de la visite */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Détails de la visite technique
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Véhicule
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {inspection.vehicleId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Kilométrage
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {inspection.mileage.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date de visite
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(
                          inspection.inspectionDate
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date d'expiration
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(inspection.expiryDate).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Coût
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {inspection.cost}TND
                      </dd>
                    </div>
                    {inspection.nextInspectionDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Prochaine visite
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            inspection.nextInspectionDate
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Défauts constatés */}
              {inspection.defects && inspection.defects.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Défauts constatés ({inspection.defects.length})
                  </h3>
                  <div className="space-y-4">
                    {inspection.defects.map((defect, index) => (
                      <div
                        key={defect.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Défaut #{index + 1}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                                defect.severity
                              )}`}
                            >
                              {getSeverityText(defect.severity)}
                            </span>
                            {defect.rectified ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Rectifié
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Non rectifié
                              </span>
                            )}
                          </div>
                        </div>

                        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Catégorie
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {getCategoryText(defect.category)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {defect.description}
                            </dd>
                          </div>
                          {defect.rectified && defect.rectificationDate && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">
                                Date de rectification
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(
                                  defect.rectificationDate
                                ).toLocaleDateString()}
                              </dd>
                            </div>
                          )}
                          {defect.rectified && defect.cost && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">
                                Coût de rectification
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {defect.cost}TND
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {inspection.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notes
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {inspection.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations secondaires */}
            <div className="space-y-6">
              {/* Informations sur l'inspecteur et le centre */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informations sur l'inspection
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Inspecteur
                      </p>
                      <p className="text-sm text-gray-500">
                        {inspection.inspectorName}
                      </p>
                    </div>
                  </div>
                  {inspection.responsible && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Responsable
                        </p>
                        <p className="text-sm text-gray-500">
                          {inspection.responsible}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Centre de contrôle
                      </p>
                      <p className="text-sm text-gray-500">
                        {inspection.inspectionCenter}
                      </p>
                      {inspection.centerAddress && (
                        <p className="text-sm text-gray-500">
                          {inspection.centerAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  {inspection.centerPhone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Téléphone
                        </p>
                        <p className="text-sm text-gray-500">
                          {inspection.centerPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Résumé financier */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Résumé financier
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Coût de la visite
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {inspection.cost}TND
                      </dd>
                    </div>
                    {inspection.defects &&
                      inspection.defects.some((d) => d.rectified && d.cost) && (
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">
                            Coût des rectifications
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {inspection.defects
                              .filter((d) => d.rectified && d.cost)
                              .reduce((sum, d) => sum + (d.cost || 0), 0)}
                            TND
                          </dd>
                        </div>
                      )}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-900">
                          Total
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {inspection.cost +
                            (inspection.defects
                              ?.filter((d) => d.rectified && d.cost)
                              .reduce((sum, d) => sum + (d.cost || 0), 0) || 0)}
                          TND
                        </dd>
                      </div>
                    </div>
                  </dl>
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
                        {new Date(inspection.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Modifié le
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(inspection.updatedAt).toLocaleDateString()}
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

export default TechnicalInspectionDetails;
