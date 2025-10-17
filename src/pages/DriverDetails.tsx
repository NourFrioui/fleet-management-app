import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  Phone,
  Mail,
  Car,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { mockDrivers, mockVehicles } from "../data/mockData";
import type { Driver, Vehicle } from "../types";

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [assignedVehicle, setAssignedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        // En production, remplacer par : const response = await driverService.getById(id);

        // Trouver le chauffeur dans les données mockées
        const foundDriver = mockDrivers.find((d) => d.id === id);
        if (foundDriver) {
          setDriver(foundDriver);

          // Trouver le véhicule assigné si il y en a un
          if (foundDriver.assignedVehicleId) {
            const vehicle = mockVehicles.find(
              (v) => v.id === foundDriver.assignedVehicleId
            );
            setAssignedVehicle(vehicle || null);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du chauffeur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "suspended":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "suspended":
        return "Suspendu";
      case "inactive":
        return "Inactif";
      default:
        return status;
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isLicenseExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getDaysUntilLicenseExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Chauffeur non trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Le chauffeur que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link
            to="/drivers"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux chauffeurs
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
            to="/drivers"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Chauffeur • {driver.licenseNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              driver.status
            )}`}
          >
            {getStatusIcon(driver.status)}
            <span className="ml-1">{getStatusText(driver.status)}</span>
          </span>
          <Link
            to={`/drivers/${driver.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Alertes */}
      {isLicenseExpired(driver.licenseExpiryDate) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Permis de conduire expiré
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Le permis de conduire a expiré le{" "}
                {new Date(driver.licenseExpiryDate).toLocaleDateString()}. Un
                renouvellement immédiat est nécessaire.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLicenseExpiringSoon(driver.licenseExpiryDate) &&
        !isLicenseExpired(driver.licenseExpiryDate) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Permis de conduire expirant bientôt
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Le permis de conduire expire dans{" "}
                  {getDaysUntilLicenseExpiry(driver.licenseExpiryDate)} jours (
                  {new Date(driver.licenseExpiryDate).toLocaleDateString()}).
                  Pensez à renouveler.
                </p>
              </div>
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nom complet
                  </p>
                  <p className="text-sm text-gray-900">{driver.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">
                    <a
                      href={`mailto:${driver.email}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {driver.email}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  <p className="text-sm text-gray-900">
                    <a
                      href={`tel:${driver.phone}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {driver.phone}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Numéro de permis
                  </p>
                  <p className="text-sm text-gray-900">
                    {driver.licenseNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations professionnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date d'embauche
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(driver.hireDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expiration du permis
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                  </p>
                  {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                    <p className="text-xs text-yellow-600">
                      Expire dans{" "}
                      {getDaysUntilLicenseExpiry(driver.licenseExpiryDate)}{" "}
                      jours
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <p className="text-sm text-gray-900">
                    {getStatusText(driver.status)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Membre depuis
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Véhicule assigné */}
          {assignedVehicle && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Véhicule assigné
              </h2>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {assignedVehicle.plateNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {assignedVehicle.brand} {assignedVehicle.model} (
                        {assignedVehicle.year})
                      </p>
                    </div>
                    <Link
                      to={`/vehicles/${assignedVehicle.id}`}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Voir détails →
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {assignedVehicle.mileage.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignedVehicle.status === "active"
                            ? "bg-green-100 text-green-800"
                            : assignedVehicle.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assignedVehicle.status === "active"
                          ? "Actif"
                          : assignedVehicle.status === "maintenance"
                          ? "Maintenance"
                          : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historique des véhicules (simulé) */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Historique des véhicules
            </h2>
            <div className="space-y-3">
              {assignedVehicle ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assignedVehicle.plateNumber} - {assignedVehicle.brand}{" "}
                        {assignedVehicle.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        Assigné depuis{" "}
                        {new Date(driver.hireDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actuel
                  </span>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Car className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Aucun véhicule assigné actuellement
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photo de profil (placeholder) */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {driver.name}
              </h3>
              <p className="text-sm text-gray-500">{driver.email}</p>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    driver.status
                  )}`}
                >
                  {getStatusIcon(driver.status)}
                  <span className="ml-2">{getStatusText(driver.status)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link
                to={`/drivers/${driver.id}/edit`}
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Edit className="h-4 w-4 inline mr-2" />
                Modifier les informations
              </Link>
              {assignedVehicle && (
                <Link
                  to={`/vehicles/${assignedVehicle.id}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Car className="h-4 w-4 inline mr-2" />
                  Voir le véhicule assigné
                </Link>
              )}
              <button className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <FileText className="h-4 w-4 inline mr-2" />
                Générer un rapport
              </button>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <a
                  href={`mailto:${driver.email}`}
                  className="text-sm text-primary-600 hover:text-primary-900"
                >
                  {driver.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-3" />
                <a
                  href={`tel:${driver.phone}`}
                  className="text-sm text-primary-600 hover:text-primary-900"
                >
                  {driver.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Informations du permis */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Permis de conduire
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Numéro
                </span>
                <span className="text-sm text-gray-900">
                  {driver.licenseNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Expire le
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Statut
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isLicenseExpired(driver.licenseExpiryDate)
                      ? "bg-red-100 text-red-800"
                      : isLicenseExpiringSoon(driver.licenseExpiryDate)
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {isLicenseExpired(driver.licenseExpiryDate)
                    ? "Expiré"
                    : isLicenseExpiringSoon(driver.licenseExpiryDate)
                    ? "Expire bientôt"
                    : "Valide"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
