import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import type {
  Alert,
  Vehicle,
  TechnicalInspection,
  OilChange,
  Insurance,
} from "../types";

const AlertsPage: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // Mock data
  const mockVehicles: Vehicle[] = [
    {
      id: "1",
      plateNumber: "123 TUN 4567",
      brand: "Renault",
      model: "Clio",
      year: 2020,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 48500,
      fuelType: "gasoline",
      color: "Bleu",
      purchaseDate: "2020-01-15",
      lastMaintenanceDate: "2024-02-20",
      nextMaintenanceDate: "2024-08-20",
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2024-02-20T00:00:00Z",
    },
    {
      id: "2",
      plateNumber: "456 TUN 7890",
      brand: "Peugeot",
      model: "208",
      year: 2021,
      type: "car",
      category: "passenger",
      status: "active",
      mileage: 52500,
      fuelType: "diesel",
      color: "Blanc",
      purchaseDate: "2021-03-10",
      lastMaintenanceDate: "2024-03-10",
      nextMaintenanceDate: "2024-09-10",
      createdAt: "2021-03-10T00:00:00Z",
      updatedAt: "2024-03-10T00:00:00Z",
    },
  ];

  const mockTechnicalInspections: TechnicalInspection[] = [
    {
      id: "1",
      vehicleId: "1",
      inspectionType: "periodic",
      inspectionDate: "2024-04-05",
      expiryDate: "2025-04-05",
      result: "favorable",
      mileage: 48000,
      cost: 50,
      inspectorName: "Inspecteur Tunisien",
      inspectionCenter: "Centre Technique Auto Tunis",
      createdAt: "2024-04-05T00:00:00Z",
      updatedAt: "2024-04-05T00:00:00Z",
    },
  ];

  const mockOilChanges: OilChange[] = [
    {
      id: "1",
      vehicleId: "2",
      scheduledDate: "2024-02-15",
      completedDate: "2024-02-15",
      nextOilChangeDate: "2024-08-15",
      oilType: "synthetic",
      oilBrand: "Total Quartz",
      oilQuantity: 4.5,
      filterChanged: true,
      mileage: 51500,
      nextOilChangeMileage: 56500,
      cost: 85,
      serviceCenter: "Garage Professionnel Sfax",
      status: "completed",
      createdAt: "2024-02-15T00:00:00Z",
      updatedAt: "2024-02-15T00:00:00Z",
    },
  ];

  const mockInsurances: Insurance[] = [
    {
      id: "1",
      vehicleId: "1",
      type: "comprehensive",
      company: "STAR Assurances",
      policyNumber: "POL-123456",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      premium: 2400,
      premiumExcludingTax: 2016.0,
      vatRate: 19,
      vatAmount: 383.04,
      fiscalStamp: 1.0,
      otherTaxes: 0,
      totalTaxAmount: 384.04,
      premiumIncludingTax: 2400.04,
      coverage: 80000,
      deductible: 500,
      status: "active",
      agentName: "Mohamed Ben Ali",
      agentPhone: "+216 71 234 567",
      notes: "Assurance tous risques avec assistance 24h/24",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ];

  // Générer automatiquement les alertes
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    const today = new Date();

    // Alertes pour les visites techniques
    mockTechnicalInspections.forEach((inspection) => {
      const expiryDate = new Date(inspection.expiryDate);
      const diffDays = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 7 && diffDays > 0) {
        const vehicle = mockVehicles.find((v) => v.id === inspection.vehicleId);
        alerts.push({
          id: `tech-${inspection.id}-7d`,
          type: "technical_inspection",
          title: "Visite Technique à Renouveler",
          message: `La visite technique du véhicule ${
            vehicle?.plateNumber || "inconnu"
          } expire dans ${diffDays} jour(s)`,
          relatedId: inspection.id,
          relatedType: "technical_inspection",
          vehicleId: inspection.vehicleId,
          vehicle,
          dueDate: inspection.expiryDate,
          alertDate: new Date(
            expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: diffDays <= 3 ? "high" : "medium",
          status: "pending",
          daysBefore: diffDays <= 3 ? 3 : 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Alertes pour les vidanges
    mockOilChanges.forEach((oilChange) => {
      if (oilChange.nextOilChangeDate) {
        const nextDate = new Date(oilChange.nextOilChangeDate);
        const diffDays = Math.ceil(
          (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 7 && diffDays > 0) {
          const vehicle = mockVehicles.find(
            (v) => v.id === oilChange.vehicleId
          );
          alerts.push({
            id: `oil-${oilChange.id}-7d`,
            type: "oil_change",
            title: "Vidange à Effectuer",
            message: `La vidange du véhicule ${
              vehicle?.plateNumber || "inconnu"
            } doit être effectuée dans ${diffDays} jour(s)`,
            relatedId: oilChange.id,
            relatedType: "oil_change",
            vehicleId: oilChange.vehicleId,
            vehicle,
            dueDate: oilChange.nextOilChangeDate,
            alertDate: new Date(
              nextDate.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            priority: diffDays <= 3 ? "high" : "medium",
            status: "pending",
            daysBefore: diffDays <= 3 ? 3 : 7,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });

    // Alertes pour les assurances
    mockInsurances.forEach((insurance) => {
      const endDate = new Date(insurance.endDate);
      const diffDays = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 7 && diffDays > 0) {
        const vehicle = mockVehicles.find((v) => v.id === insurance.vehicleId);
        alerts.push({
          id: `ins-${insurance.id}-7d`,
          type: "insurance",
          title: "Assurance à Renouveler",
          message: `L'assurance du véhicule ${
            vehicle?.plateNumber || "inconnu"
          } (${insurance.company}) expire dans ${diffDays} jour(s)`,
          relatedId: insurance.id,
          relatedType: "insurance",
          vehicleId: insurance.vehicleId,
          vehicle,
          dueDate: insurance.endDate,
          alertDate: new Date(
            endDate.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: diffDays <= 3 ? "high" : "medium",
          status: "pending",
          daysBefore: diffDays <= 3 ? 3 : 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return alerts.sort((a, b) => {
      // Trier par priorité puis par date
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(generateAlerts());
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority =
      filterPriority === "" || alert.priority === filterPriority;
    const matchesStatus = filterStatus === "" || alert.status === filterStatus;
    const matchesType = filterType === "" || alert.type === filterType;

    return matchesPriority && matchesStatus && matchesType;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "medium":
        return <Bell className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      technical_inspection: "Visite Technique",
      oil_change: "Vidange",
      insurance: "Assurance",
      maintenance: "Maintenance",
      tire_change: "Changement Pneu",
      license_expiry: "Permis Expiré",
    };
    return labels[type] || type;
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "dismissed" as const } : alert
      )
    );
  };

  const handleComplete = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "completed" as const } : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alertes et Rappels</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les alertes et rappels automatiques pour votre flotte
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Alertes Actives
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Haute Priorité
              </p>
              <p className="text-2xl font-bold text-red-600">
                {alerts.filter((a) => a.priority === "high").length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complétées</p>
              <p className="text-2xl font-bold text-green-600">
                {alerts.filter((a) => a.status === "completed").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ignorées</p>
              <p className="text-2xl font-bold text-gray-600">
                {alerts.filter((a) => a.status === "dismissed").length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <XCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Toutes les priorités</option>
            <option value="high">Haute priorité</option>
            <option value="medium">Priorité moyenne</option>
            <option value="low">Priorité basse</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="sent">Envoyée</option>
            <option value="completed">Complétée</option>
            <option value="dismissed">Ignorée</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="technical_inspection">Visite Technique</option>
            <option value="oil_change">Vidange</option>
            <option value="insurance">Assurance</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune alerte à afficher</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(
                alert.priority
              )} p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getPriorityIcon(alert.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeLabel(alert.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Échéance:{" "}
                          {new Date(alert.dueDate).toLocaleDateString("fr-TN")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Rappel: {alert.daysBefore} jour(s) avant</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {alert.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleComplete(alert.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Marquer comme complété"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Ignorer"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {alert.status === "completed" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Complété
                    </span>
                  )}
                  {alert.status === "dismissed" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Ignoré
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
