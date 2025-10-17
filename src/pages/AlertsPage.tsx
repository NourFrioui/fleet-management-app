import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import type { Alert } from "../types";
import {
  mockVehicles,
  mockTechnicalInspections,
  mockOilChanges,
  mockDrivers,
} from "../data/mockData";

// Mock insurances avec des dates proches pour générer des alertes
const today = new Date();
const in5Days = new Date(today);
in5Days.setDate(today.getDate() + 5);
const in10Days = new Date(today);
in10Days.setDate(today.getDate() + 10);
const in20Days = new Date(today);
in20Days.setDate(today.getDate() + 20);
const in6Months = new Date(today);
in6Months.setMonth(today.getMonth() + 6);

const mockInsurances = [
  {
    id: "1",
    vehicleId: "1",
    type: "comprehensive" as const,
    company: "STAR Assurances",
    policyNumber: "POL-123456",
    startDate: new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
    endDate: in5Days.toISOString().split("T")[0],
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
    status: "active" as const,
    agentName: "Mohamed Ben Ali",
    agentPhone: "+216 71 234 567",
    notes: "Assurance tous risques avec assistance 24h/24",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "2",
    type: "third_party" as const,
    company: "GAT Assurances",
    policyNumber: "POL-789012",
    startDate: new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
    endDate: in10Days.toISOString().split("T")[0],
    premium: 1600,
    premiumExcludingTax: 1344.0,
    vatRate: 19,
    vatAmount: 255.36,
    fiscalStamp: 1.0,
    otherTaxes: 0,
    totalTaxAmount: 256.36,
    premiumIncludingTax: 1600.36,
    coverage: 40000,
    deductible: 300,
    status: "active" as const,
    agentName: "Fatma Trabelsi",
    agentPhone: "+216 74 456 789",
    notes: "Assurance au tiers",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "3",
    type: "comprehensive" as const,
    company: "COMAR",
    policyNumber: "POL-345678",
    startDate: new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
    endDate: in20Days.toISOString().split("T")[0],
    premium: 2800,
    premiumExcludingTax: 2352.0,
    vatRate: 19,
    vatAmount: 446.88,
    fiscalStamp: 1.0,
    otherTaxes: 0,
    totalTaxAmount: 447.88,
    premiumIncludingTax: 2799.88,
    coverage: 100000,
    deductible: 600,
    status: "active" as const,
    agentName: "Ahmed Karim",
    agentPhone: "+216 98 123 456",
    notes: "Assurance tous risques premium",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "4",
    type: "third_party" as const,
    company: "STAR Assurances",
    policyNumber: "POL-567890",
    startDate: new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
    endDate: in6Months.toISOString().split("T")[0],
    premium: 1400,
    premiumExcludingTax: 1176.0,
    vatRate: 19,
    vatAmount: 223.44,
    fiscalStamp: 1.0,
    otherTaxes: 0,
    totalTaxAmount: 224.44,
    premiumIncludingTax: 1400.44,
    coverage: 35000,
    deductible: 250,
    status: "active" as const,
    agentName: "Salma Jebali",
    agentPhone: "+216 22 987 654",
    notes: "Assurance au tiers",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const AlertsPage: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

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

      if (diffDays <= 7 && diffDays >= 0) {
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
          vehicle: vehicle,
          dueDate: inspection.expiryDate,
          alertDate: new Date(
            expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: diffDays <= 3 ? "high" : "medium",
          status: "pending",
          daysBefore: 7,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        });
      }

      if (diffDays <= 3 && diffDays >= 0) {
        const vehicle = mockVehicles.find((v) => v.id === inspection.vehicleId);
        alerts.push({
          id: `tech-${inspection.id}-3d`,
          type: "technical_inspection",
          title: "Visite Technique URGENTE",
          message: `URGENT: La visite technique du véhicule ${
            vehicle?.plateNumber || "inconnu"
          } expire dans ${diffDays} jour(s) !`,
          relatedId: inspection.id,
          relatedType: "technical_inspection",
          vehicleId: inspection.vehicleId,
          vehicle: vehicle,
          dueDate: inspection.expiryDate,
          alertDate: new Date(
            expiryDate.getTime() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: "high",
          status: "pending",
          daysBefore: 3,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
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

        if (diffDays <= 7 && diffDays >= 0) {
          const vehicle = mockVehicles.find(
            (v) => v.id === oilChange.vehicleId
          );
          alerts.push({
            id: `oil-${oilChange.id}-7d`,
            type: "oil_change",
            title: "Vidange à Effectuer",
            message: `La vidange du véhicule ${
              vehicle?.plateNumber || "inconnu"
            } est prévue dans ${diffDays} jour(s)`,
            relatedId: oilChange.id,
            relatedType: "oil_change",
            vehicleId: oilChange.vehicleId,
            vehicle: vehicle,
            dueDate: oilChange.nextOilChangeDate,
            alertDate: new Date(
              nextDate.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            priority: diffDays <= 3 ? "high" : "medium",
            status: "pending",
            daysBefore: 7,
            createdAt: today.toISOString(),
            updatedAt: today.toISOString(),
          });
        }

        if (diffDays <= 3 && diffDays >= 0) {
          const vehicle = mockVehicles.find(
            (v) => v.id === oilChange.vehicleId
          );
          alerts.push({
            id: `oil-${oilChange.id}-3d`,
            type: "oil_change",
            title: "Vidange URGENTE",
            message: `URGENT: La vidange du véhicule ${
              vehicle?.plateNumber || "inconnu"
            } est prévue dans ${diffDays} jour(s) !`,
            relatedId: oilChange.id,
            relatedType: "oil_change",
            vehicleId: oilChange.vehicleId,
            vehicle: vehicle,
            dueDate: oilChange.nextOilChangeDate,
            alertDate: new Date(
              nextDate.getTime() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            priority: "high",
            status: "pending",
            daysBefore: 3,
            createdAt: today.toISOString(),
            updatedAt: today.toISOString(),
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

      if (diffDays <= 7 && diffDays >= 0) {
        const vehicle = mockVehicles.find((v) => v.id === insurance.vehicleId);
        alerts.push({
          id: `ins-${insurance.id}-7d`,
          type: "insurance",
          title: "Assurance à Renouveler",
          message: `L'assurance du véhicule ${
            vehicle?.plateNumber || "inconnu"
          } expire dans ${diffDays} jour(s)`,
          relatedId: insurance.id,
          relatedType: "insurance",
          vehicleId: insurance.vehicleId,
          vehicle: vehicle,
          dueDate: insurance.endDate,
          alertDate: new Date(
            endDate.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: diffDays <= 3 ? "high" : "medium",
          status: "pending",
          daysBefore: 7,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        });
      }

      if (diffDays <= 3 && diffDays >= 0) {
        const vehicle = mockVehicles.find((v) => v.id === insurance.vehicleId);
        alerts.push({
          id: `ins-${insurance.id}-3d`,
          type: "insurance",
          title: "Assurance URGENTE",
          message: `URGENT: L'assurance du véhicule ${
            vehicle?.plateNumber || "inconnu"
          } expire dans ${diffDays} jour(s) !`,
          relatedId: insurance.id,
          relatedType: "insurance",
          vehicleId: insurance.vehicleId,
          vehicle: vehicle,
          dueDate: insurance.endDate,
          alertDate: new Date(
            endDate.getTime() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: "high",
          status: "pending",
          daysBefore: 3,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        });
      }
    });

    // Alertes pour les permis de conduire
    mockDrivers.forEach((driver) => {
      const expiryDate = new Date(driver.licenseExpiryDate);
      const diffDays = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 30 && diffDays >= 0) {
        alerts.push({
          id: `license-${driver.id}-30d`,
          type: "license_expiry",
          title: "Permis de Conduire à Renouveler",
          message: `Le permis de conduire de ${driver.name} expire dans ${diffDays} jour(s)`,
          relatedId: driver.id,
          relatedType: "driver",
          dueDate: driver.licenseExpiryDate,
          alertDate: new Date(
            expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          priority: diffDays <= 7 ? "high" : "medium",
          status: "pending",
          daysBefore: 30,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        });
      }
    });

    return alerts;
  };

  const allAlerts = generateAlerts();

  const filteredAlerts = allAlerts.filter((alert) => {
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
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "technical_inspection":
        return "Visite Technique";
      case "oil_change":
        return "Vidange";
      case "insurance":
        return "Assurance";
      case "maintenance":
        return "Maintenance";
      case "license_expiry":
        return "Permis de Conduire";
      case "tire_change":
        return "Changement de Pneus";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Alertes & Rappels
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les alertes et rappels automatiques pour votre flotte
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alertes</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAlerts.length}
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
                Priorité Haute
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAlerts.filter((a) => a.priority === "high").length}
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
              <p className="text-sm font-medium text-gray-600">
                Priorité Moyenne
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAlerts.filter((a) => a.priority === "medium").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAlerts.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
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
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="sent">Envoyée</option>
            <option value="dismissed">Ignorée</option>
            <option value="completed">Complétée</option>
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
            <option value="license_expiry">Permis de Conduire</option>
          </select>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aucune alerte pour le moment
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Toutes vos maintenances et assurances sont à jour
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow-md border-l-4 p-6 ${getPriorityColor(
                alert.priority
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getPriorityIcon(alert.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeText(alert.type)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Échéance:{" "}
                          {new Date(alert.dueDate).toLocaleDateString("fr-TN")}
                        </span>
                      </div>
                      {alert.vehicle && (
                        <div className="flex items-center">
                          <span className="font-medium">
                            {alert.vehicle.plateNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <XCircle className="h-5 w-5" />
                  </button>
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
