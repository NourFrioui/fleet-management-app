import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Shield,
  Calendar,
  Phone,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import { mockVehicles } from "../data/mockData";
import { INSURANCE_TYPES, INSURANCE_STATUSES } from "../utils/vehicleConstants";
import type { Insurance, Vehicle } from "../types";

const InsuranceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try {
        // En production, remplacer par : const response = await insuranceService.getById(id);

        // Données d'assurance mockées
        const mockInsurance: Insurance = {
          id: id!,
          vehicleId: "1",
          type: "comprehensive",
          company: "AXA",
          policyNumber: "POL-123456",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          premium: 1200,
          coverage: 50000,
          deductible: 500,
          status: "active",
          agentName: "Jean Dupont",
          agentPhone: "01 23 45 67 89",
          notes:
            "Assurance tous risques avec assistance 24h/24. Couverture étendue pour véhicule commercial.",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        setInsurance(mockInsurance);

        // Trouver le véhicule associé
        const associatedVehicle = mockVehicles.find(
          (v) => v.id === mockInsurance.vehicleId
        );
        setVehicle(associatedVehicle || null);
      } catch (error) {
        console.error("Erreur lors du chargement de l'assurance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInsuranceDetails();
    }
  }, [id]);

  const getInsuranceStatusColor = (status: string) => {
    const statusObj = INSURANCE_STATUSES.find((s) => s.value === status);
    switch (statusObj?.color) {
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "gray":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsuranceTypeText = (type: string) => {
    const typeObj = INSURANCE_TYPES.find((t) => t.value === type);
    return typeObj?.label || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!insurance) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Assurance non trouvée
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          L'assurance que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link
            to="/insurance"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux assurances
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
          <Link
            to="/insurance"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {insurance.policyNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {insurance.company} - {getInsuranceTypeText(insurance.type)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInsuranceStatusColor(
              insurance.status
            )}`}
          >
            {getStatusIcon(insurance.status)}
            <span className="ml-1">
              {insurance.status === "active"
                ? "Active"
                : insurance.status === "expired"
                ? "Expirée"
                : "Annulée"}
            </span>
          </span>
          <Link
            to={`/insurance/${insurance.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Alertes */}
      {isExpired(insurance.endDate) && insurance.status === "active" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Assurance expirée
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Cette assurance a expiré le{" "}
                {new Date(insurance.endDate).toLocaleDateString()}. Un
                renouvellement immédiat est nécessaire.
              </p>
            </div>
          </div>
        </div>
      )}

      {isExpiringSoon(insurance.endDate) && insurance.status === "active" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Assurance expirant bientôt
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Cette assurance expire dans{" "}
                {getDaysUntilExpiry(insurance.endDate)} jours (
                {new Date(insurance.endDate).toLocaleDateString()}). Pensez à
                renouveler.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Compagnie</p>
                  <p className="text-sm text-gray-900">{insurance.company}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Numéro de police
                  </p>
                  <p className="text-sm text-gray-900">
                    {insurance.policyNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date de début
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(insurance.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date de fin
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(insurance.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations financières */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations financières
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  Prime annuelle TTC
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {(
                    insurance.premiumIncludingTax || insurance.premium
                  ).toLocaleString()}{" "}
                  TND
                </p>
                <p className="text-xs text-gray-500">
                  {(
                    (insurance.premiumIncludingTax || insurance.premium) / 12
                  ).toFixed(2)}{" "}
                  TND/mois
                </p>
                {insurance.premiumExcludingTax && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p>
                      HT: {insurance.premiumExcludingTax.toLocaleString()} TND
                    </p>
                    <p>
                      TVA ({insurance.vatRate}%):{" "}
                      {insurance.vatAmount?.toFixed(2)} TND
                    </p>
                    {insurance.fiscalStamp && insurance.fiscalStamp > 0 && (
                      <p>
                        Timbre fiscal: {insurance.fiscalStamp.toFixed(2)} TND
                      </p>
                    )}
                    {insurance.otherTaxes && insurance.otherTaxes > 0 && (
                      <p>Autres taxes: {insurance.otherTaxes.toFixed(2)} TND</p>
                    )}
                    <p className="font-medium">
                      Total taxes: {insurance.totalTaxAmount?.toFixed(2)} TND
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Couverture</p>
                <p className="text-2xl font-bold text-green-600">
                  {insurance.coverage.toLocaleString()}TND
                </p>
                <p className="text-xs text-gray-500">Montant maximum</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Franchise</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {insurance.deductible.toLocaleString()}TND
                </p>
                <p className="text-xs text-gray-500">Montant non remboursé</p>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          {insurance.agentName && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Contact agent d'assurance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-sm text-gray-900">
                      {insurance.agentName}
                    </p>
                  </div>
                </div>
                {insurance.agentPhone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Téléphone
                      </p>
                      <p className="text-sm text-gray-900">
                        <a
                          href={`tel:${insurance.agentPhone}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {insurance.agentPhone}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {insurance.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {insurance.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Véhicule associé */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Véhicule assuré
            </h3>
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
                    Type
                  </span>
                  <span className="text-sm text-gray-900">
                    {vehicle.type === "truck"
                      ? "Camion"
                      : vehicle.type === "car"
                      ? "Voiture"
                      : vehicle.type === "van"
                      ? "Van"
                      : vehicle.type}
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

          {/* Informations de type */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Type d'assurance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span className="text-sm text-gray-900">
                  {getInsuranceTypeText(insurance.type)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Statut
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInsuranceStatusColor(
                    insurance.status
                  )}`}
                >
                  {insurance.status === "active"
                    ? "Active"
                    : insurance.status === "expired"
                    ? "Expirée"
                    : "Annulée"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <span className="text-sm text-gray-900">1 an</span>
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
                  Début de couverture
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(insurance.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fin de couverture
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(insurance.endDate).toLocaleDateString()}
                </p>
                {isExpiringSoon(insurance.endDate) && (
                  <p className="text-xs text-yellow-600">
                    Expire dans {getDaysUntilExpiry(insurance.endDate)} jours
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Créée le</p>
                <p className="text-sm text-gray-900">
                  {new Date(insurance.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modifiée le</p>
                <p className="text-sm text-gray-900">
                  {new Date(insurance.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetails;
