import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  Shield,
  RefreshCw,
} from "lucide-react";
import { mockVehicles } from "../data/mockData";
import type { Insurance as InsuranceType } from "../types";

const Insurance: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");

  // Données d'assurance mockées
  const mockInsurances: InsuranceType[] = [
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
    {
      id: "2",
      vehicleId: "2",
      type: "third_party",
      company: "GAT Assurances",
      policyNumber: "POL-789012",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
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
      status: "expired",
      agentName: "Fatma Trabelsi",
      agentPhone: "+216 74 456 789",
      notes: "Assurance au tiers",
      createdAt: "2023-06-01T00:00:00Z",
      updatedAt: "2023-06-01T00:00:00Z",
    },
    {
      id: "3",
      vehicleId: "3",
      type: "commercial",
      company: "COMAR",
      policyNumber: "POL-345678",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      premium: 3000,
      premiumExcludingTax: 2521.0,
      vatRate: 19,
      vatAmount: 478.99,
      fiscalStamp: 1.0,
      otherTaxes: 0,
      totalTaxAmount: 479.99,
      premiumIncludingTax: 3000.99,
      coverage: 100000,
      deductible: 1000,
      status: "active",
      agentName: "Karim Gharbi",
      agentPhone: "+216 22 345 678",
      notes: "Assurance commerciale pour véhicule utilitaire",
      createdAt: "2024-03-01T00:00:00Z",
      updatedAt: "2024-03-01T00:00:00Z",
    },
  ];

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`
      : "Véhicule inconnu";
  };

  const filteredInsurances = mockInsurances.filter((insurance) => {
    const matchesSearch =
      searchTerm === "" ||
      insurance.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVehicleInfo(insurance.vehicleId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || insurance.status === filterStatus;

    const matchesVehicle =
      filterVehicle === "" || insurance.vehicleId === filterVehicle;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const totalPremium = filteredInsurances.reduce(
    (sum, ins) => sum + (ins.premiumIncludingTax || ins.premium),
    0
  );

  const handleRenewal = (insurance: InsuranceType) => {
    const oldEndDate = new Date(insurance.endDate);
    const newStartDate = new Date(oldEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const params = new URLSearchParams({
      vehicleId: insurance.vehicleId,
      type: insurance.type,
      company: insurance.company,
      startDate: newStartDate.toISOString().split("T")[0],
      endDate: newEndDate.toISOString().split("T")[0],
      premiumExcludingTax: String(insurance.premiumExcludingTax || 0),
      vatRate: String(insurance.vatRate || 19),
      fiscalStamp: String(insurance.fiscalStamp || 1),
      otherTaxes: String(insurance.otherTaxes || 0),
      coverage: String(insurance.coverage),
      deductible: String(insurance.deductible),
      agentName: insurance.agentName || "",
      agentPhone: insurance.agentPhone || "",
    });

    navigate(`/insurance/new?${params.toString()}`);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette assurance ?")
    ) {
      console.log("Delete insurance:", id);
    }
  };

  const handleExport = () => {
    console.log("Export insurance data");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Assurances
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez toutes les assurances de votre flotte
          </p>
        </div>
        <button
          onClick={() => navigate("/insurance/new")}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle assurance
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Assurances
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInsurances.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPremium.toFixed(2)} TND
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInsurances.length > 0
                  ? (totalPremium / filteredInsurances.length).toFixed(2)
                  : "0.00"}{" "}
                TND
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInsurances.filter((i) => i.status === "active").length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="expired">Expirée</option>
            <option value="cancelled">Annulée</option>
          </select>

          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tous les véhicules</option>
            {mockVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Liste des assurances */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compagnie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Police N°
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prime (TTC)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInsurances.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Aucune assurance trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredInsurances.map((insurance) => (
                  <tr key={insurance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getVehicleInfo(insurance.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {insurance.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {insurance.type === "comprehensive"
                        ? "Tous risques"
                        : insurance.type === "third_party"
                        ? "Au tiers"
                        : insurance.type === "commercial"
                        ? "Commercial"
                        : insurance.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {insurance.policyNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(insurance.startDate).toLocaleDateString(
                        "fr-TN"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(insurance.endDate).toLocaleDateString("fr-TN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(
                        insurance.premiumIncludingTax || insurance.premium
                      ).toFixed(2)}{" "}
                      TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          insurance.status === "active"
                            ? "bg-green-100 text-green-800"
                            : insurance.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {insurance.status === "active"
                          ? "Active"
                          : insurance.status === "expired"
                          ? "Expirée"
                          : "Annulée"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRenewal(insurance)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Renouveler"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/insurance/${insurance.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Voir détails"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(insurance.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
