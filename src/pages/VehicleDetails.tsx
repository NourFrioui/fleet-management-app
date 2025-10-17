import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Truck,
  Calendar,
  Fuel,
  Wrench,
  User,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  FileText,
  Plus,
} from "lucide-react";
import {
  mockVehicles,
  mockDrivers,
  mockMaintenances,
  mockFuelRecords,
  mockOilChanges,
  mockTechnicalInspections,
} from "../data/mockData";
import {
  MAINTENANCE_TYPES,
  INSURANCE_TYPES,
  INSURANCE_STATUSES,
} from "../utils/vehicleConstants";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicle = mockVehicles.find((v) => v.id === id);
  const [activeTab, setActiveTab] = useState("overview");

  // Données liées au véhicule
  const assignedDriver = vehicle?.assignedDriverId
    ? mockDrivers.find((d) => d.id === vehicle.assignedDriverId)
    : null;

  const vehicleMaintenances = mockMaintenances.filter(
    (m) => m.vehicleId === id
  );
  const vehicleFuelRecords = mockFuelRecords.filter((f) => f.vehicleId === id);

  // Données d'assurance mockées pour ce véhicule
  const vehicleInsurances = [
    {
      id: "1",
      vehicleId: id,
      type: "comprehensive",
      company: "STAR Assurances",
      policyNumber: "POL-123456",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      premium: 2400,
      coverage: 50000,
      deductible: 500,
      status: "active",
      agentName: "Mohamed Ben Ali",
      agentPhone: "+216 71 234 567",
      notes: "Assurance tous risques avec assistance 24h/24",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ];

  // Calculs des dates de vidange
  const vehicleOilChanges = mockOilChanges.filter((oc) => oc.vehicleId === id);
  const lastOilChange = vehicleOilChanges
    .filter((m) => m.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completedDate!).getTime() -
        new Date(a.completedDate!).getTime()
    )[0];

  const nextOilChange = vehicleOilChanges
    .filter((m) => m.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    )[0];

  // Calculs des visites techniques
  const vehicleInspections = mockTechnicalInspections.filter(
    (i) => i.vehicleId === id
  );
  const lastInspection = vehicleInspections.sort(
    (a, b) =>
      new Date(b.inspectionDate).getTime() -
      new Date(a.inspectionDate).getTime()
  )[0];

  const nextInspection = lastInspection?.nextInspectionDate
    ? {
        date: lastInspection.nextInspectionDate,
        center: lastInspection.inspectionCenter,
      }
    : null;

  // Calculs des prochaines maintenances
  const upcomingMaintenances = vehicleMaintenances
    .filter((m) => m.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );

  const upcomingOilChanges = vehicleOilChanges
    .filter((m) => m.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );

  // Calcul de la consommation moyenne
  const totalFuelCost = vehicleFuelRecords.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const totalQuantity = vehicleFuelRecords.reduce(
    (sum, record) => sum + record.quantity,
    0
  );
  const averageConsumption =
    totalQuantity > 0 ? (totalFuelCost / totalQuantity).toFixed(2) : 0;

  // Fonctions utilitaires

  const getMaintenanceStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
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

  const getMaintenanceTypeText = (type: string) => {
    const maintenanceType = MAINTENANCE_TYPES.find((t) => t.value === type);
    return maintenanceType?.label || type;
  };

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

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <Truck className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Véhicule non trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Le véhicule que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link
            to="/vehicles"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux véhicules
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "maintenance":
        return "Maintenance";
      case "inactive":
        return "Inactif";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "truck":
        return "Camion";
      case "car":
        return "Voiture";
      case "van":
        return "Van";
      default:
        return type;
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

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Truck },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "fuel", label: "Carburant", icon: Fuel },
    { id: "insurance", label: "Assurance", icon: Shield },
    { id: "driver", label: "Chauffeur", icon: User },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Informations générales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-sm text-gray-900">
                      {getTypeText(vehicle.type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className="h-5 w-5 bg-gray-400 rounded mr-3"
                    style={{ backgroundColor: vehicle.color.toLowerCase() }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Couleur</p>
                    <p className="text-sm text-gray-900">{vehicle.color}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Carburant
                    </p>
                    <p className="text-sm text-gray-900">
                      {getFuelTypeText(vehicle.fuelType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date d'achat
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(vehicle.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Kilométrage
                    </p>
                    <p className="text-sm text-gray-900">
                      {vehicle.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Carte essence
                    </p>
                    <p className="text-sm text-gray-900">
                      {vehicle.fuelCardNumber || "Non assignée"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochaines échéances */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Prochaines échéances
                </h2>
                <Link
                  to="/calendar"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Voir calendrier →
                </Link>
              </div>

              {upcomingMaintenances.length > 0 ||
              upcomingOilChanges.length > 0 ||
              nextInspection ? (
                <div className="space-y-3">
                  {/* Prochaines maintenances */}
                  {upcomingMaintenances.slice(0, 3).map((maintenance) => (
                    <div
                      key={maintenance.id}
                      className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <Wrench className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Maintenance -{" "}
                          {getMaintenanceTypeText(maintenance.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            maintenance.scheduledDate
                          ).toLocaleDateString()}{" "}
                          • {maintenance.mileage.toLocaleString()} km
                        </p>
                        {maintenance.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {maintenance.description}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/maintenance/${maintenance.id}`}
                        className="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
                      >
                        Voir →
                      </Link>
                    </div>
                  ))}

                  {/* Prochaines vidanges */}
                  {upcomingOilChanges.slice(0, 2).map((oilChange) => (
                    <div
                      key={oilChange.id}
                      className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Vidange d'huile
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            oilChange.scheduledDate
                          ).toLocaleDateString()}{" "}
                          • {oilChange.mileage.toLocaleString()} km
                        </p>
                        {oilChange.serviceCenter && (
                          <p className="text-xs text-gray-500 mt-1">
                            {oilChange.serviceCenter}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/oil-change/${oilChange.id}`}
                        className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                      >
                        Voir →
                      </Link>
                    </div>
                  ))}

                  {/* Prochaine visite technique */}
                  {nextInspection && (
                    <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Prochaine visite technique
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(nextInspection.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {nextInspection.center}
                        </p>
                      </div>
                      {lastInspection && (
                        <Link
                          to={`/technical-inspection/${lastInspection.id}`}
                          className="text-sm text-green-700 hover:text-green-900 font-medium"
                        >
                          Voir →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune échéance programmée
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Planifiez les prochaines maintenances pour ce véhicule.
                  </p>
                </div>
              )}
            </div>

            {/* Résumé des vidanges */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Informations de vidange
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Dernière vidange
                  </p>
                  <p className="text-sm text-gray-900">
                    {lastOilChange
                      ? new Date(
                          lastOilChange.completedDate!
                        ).toLocaleDateString()
                      : "Aucune vidange enregistrée"}
                  </p>
                  {lastOilChange && (
                    <p className="text-xs text-gray-500">
                      Kilométrage: {lastOilChange.mileage.toLocaleString()} km
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Prochaine vidange
                  </p>
                  <p className="text-sm text-gray-900">
                    {nextOilChange
                      ? new Date(
                          nextOilChange.scheduledDate
                        ).toLocaleDateString()
                      : "Aucune vidange programmée"}
                  </p>
                  {nextOilChange && (
                    <p className="text-xs text-gray-500">
                      Kilométrage prévu:{" "}
                      {nextOilChange.mileage.toLocaleString()} km
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Statut</h2>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {getStatusText(vehicle.status)}
                </span>
              </div>
            </div>
          </div>
        );

      case "maintenance":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Historique des maintenances
              </h2>
              <Link
                to={`/maintenance/new?vehicle=${vehicle.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle maintenance
              </Link>
            </div>

            {vehicleMaintenances.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune maintenance
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucune maintenance enregistrée pour ce véhicule.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vehicleMaintenances.map((maintenance) => (
                    <li key={maintenance.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getMaintenanceStatusIcon(maintenance.status)}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {getMaintenanceTypeText(maintenance.type)}
                                </p>
                                <span
                                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(
                                    maintenance.status
                                  )}`}
                                >
                                  {maintenance.status === "completed"
                                    ? "Terminée"
                                    : maintenance.status === "in_progress"
                                    ? "En cours"
                                    : maintenance.status === "scheduled"
                                    ? "Programmée"
                                    : "Annulée"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {maintenance.description}
                              </p>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {maintenance.status === "completed" &&
                                  maintenance.completedDate
                                    ? `Terminée le ${new Date(
                                        maintenance.completedDate
                                      ).toLocaleDateString()}`
                                    : `Programmée le ${new Date(
                                        maintenance.scheduledDate
                                      ).toLocaleDateString()}`}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  Km: {maintenance.mileage.toLocaleString()}
                                </span>
                                {maintenance.cost && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{maintenance.cost}TND</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {maintenance.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {maintenance.notes}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "fuel":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Historique de consommation de carburant
              </h2>
              <Link
                to={`/fuel/new?vehicle=${vehicle.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau plein
              </Link>
            </div>

            {/* Statistiques de consommation */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Statistiques
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total des pleins
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicleFuelRecords.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Coût total
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalFuelCost.toFixed(2)}TND
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Prix moyen au litre
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {averageConsumption}TND/L
                  </p>
                </div>
              </div>
            </div>

            {vehicleFuelRecords.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <Fuel className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune consommation enregistrée
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucune consommation de carburant enregistrée pour ce véhicule.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vehicleFuelRecords.map((record) => (
                    <li key={record.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Fuel className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {record.quantity}L -{" "}
                                  {getFuelTypeText(record.fuelType)}
                                </p>
                                <span className="ml-2 text-sm font-medium text-green-600">
                                  {record.cost}TND
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  Km: {record.mileage.toLocaleString()}
                                </span>
                                {record.station && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{record.station}</span>
                                  </>
                                )}
                              </div>
                            </div>
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
              </div>
            )}
          </div>
        );

      case "insurance":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Historique des assurances
              </h2>
              <Link
                to={`/insurance/new?vehicle=${vehicle.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle assurance
              </Link>
            </div>

            {vehicleInsurances.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune assurance
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucune assurance enregistrée pour ce véhicule.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vehicleInsurances.map((insurance) => (
                    <li key={insurance.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {insurance.policyNumber} - {insurance.company}
                                </p>
                                <span
                                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInsuranceStatusColor(
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
                              <p className="text-sm text-gray-500">
                                {getInsuranceTypeText(insurance.type)}
                              </p>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  Du{" "}
                                  {new Date(
                                    insurance.startDate
                                  ).toLocaleDateString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  Au{" "}
                                  {new Date(
                                    insurance.endDate
                                  ).toLocaleDateString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span className="font-medium">
                                  {insurance.premium}TND/an
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {insurance.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {insurance.notes}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "driver":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">
              Informations du chauffeur
            </h2>

            {assignedDriver ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {assignedDriver.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {assignedDriver.email}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignedDriver.status === "active"
                            ? "bg-green-100 text-green-800"
                            : assignedDriver.status === "suspended"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assignedDriver.status === "active"
                          ? "Actif"
                          : assignedDriver.status === "suspended"
                          ? "Suspendu"
                          : "Inactif"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {assignedDriver.phone}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {assignedDriver.licenseNumber}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Expire le{" "}
                          {new Date(
                            assignedDriver.licenseExpiryDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Embauché le{" "}
                          {new Date(
                            assignedDriver.hireDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucun chauffeur assigné
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ce véhicule n'a pas de chauffeur assigné.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/vehicles"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {vehicle.plateNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/vehicles/${vehicle.id}/files`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Fichiers
          </Link>
          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {renderTabContent()}
    </div>
  );
};

export default VehicleDetails;
