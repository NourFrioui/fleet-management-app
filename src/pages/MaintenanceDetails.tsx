import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaintenanceDetails from "../components/MaintenanceDetails";
import type { Maintenance } from "../types";

// Données mock pour les maintenances (sera remplacé par l'API)
const mockMaintenances: Maintenance[] = [
  {
    id: "1",
    vehicleId: "1",
    type: "brake_service",
    description: "Service du système de freinage",
    scheduledDate: "2024-02-10",
    completedDate: "2024-02-10",
    status: "completed",
    cost: 350,
    mileage: 125000,
    notes:
      "Changement des plaquettes et disques avant. Système de freinage en bon état.",
    technician: "Jean Dupont",
    serviceCenter: "Garage Central - Paris",
    parts: [
      {
        id: "1",
        name: "Plaquettes de frein avant",
        partNumber: "BF001",
        quantity: 2,
        unitPrice: 45.0,
        supplier: "Bosch",
      },
      {
        id: "2",
        name: "Disques de frein avant",
        partNumber: "BD001",
        quantity: 2,
        unitPrice: 85.0,
        supplier: "Brembo",
      },
      {
        id: "3",
        name: "Liquide de frein",
        partNumber: "BF002",
        quantity: 1,
        unitPrice: 12.5,
        supplier: "Castrol",
      },
    ],
    laborHours: 2.5,
    priority: "high",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "2",
    vehicleId: "2",
    type: "inspection",
    description: "Contrôle technique annuel",
    scheduledDate: "2024-03-01",
    completedDate: undefined,
    status: "scheduled",
    cost: 85,
    mileage: 25000,
    notes:
      "Inspection obligatoire. Vérification de tous les systèmes de sécurité.",
    technician: "Station de contrôle",
    serviceCenter: "Station de Contrôle - Lyon",
    priority: "medium",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "3",
    vehicleId: "1",
    type: "routine",
    description: "Maintenance préventive générale",
    scheduledDate: "2024-02-20",
    completedDate: undefined,
    status: "in_progress",
    cost: 200,
    mileage: 46000,
    notes:
      "Vérification générale des systèmes. Remplacement des filtres d'air et d'habitacle.",
    technician: "Marie Martin",
    serviceCenter: "Garage Central - Paris",
    parts: [
      {
        id: "4",
        name: "Filtre à air",
        partNumber: "AF001",
        quantity: 1,
        unitPrice: 25.0,
        supplier: "Mann",
      },
      {
        id: "5",
        name: "Filtre d'habitacle",
        partNumber: "CF001",
        quantity: 1,
        unitPrice: 18.5,
        supplier: "Bosch",
      },
    ],
    laborHours: 1.5,
    priority: "medium",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    vehicleId: "3",
    type: "engine_service",
    description: "Service moteur et climatisation",
    scheduledDate: "2024-01-30",
    completedDate: "2024-01-30",
    status: "completed",
    cost: 280,
    mileage: 180000,
    notes:
      "Recharge gaz climatisation et réparation compresseur. Moteur en bon état.",
    technician: "Pierre Durand",
    serviceCenter: "Clim Auto - Nice",
    parts: [
      {
        id: "6",
        name: "Gaz réfrigérant R134a",
        partNumber: "AC001",
        quantity: 1,
        unitPrice: 45.0,
        supplier: "Dupont",
      },
      {
        id: "7",
        name: "Compresseur climatisation",
        partNumber: "AC002",
        quantity: 1,
        unitPrice: 180.0,
        supplier: "Valeo",
      },
    ],
    laborHours: 3.0,
    priority: "high",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "5",
    vehicleId: "4",
    type: "tire_change",
    description: "Changement de pneus hiver",
    scheduledDate: "2024-02-15",
    completedDate: undefined,
    status: "scheduled",
    cost: 450,
    mileage: 38000,
    notes:
      "Remplacement des 4 pneus par des pneus hiver. Équilibrage et géométrie inclus.",
    technician: "Auto Pneus",
    serviceCenter: "Auto Pneus - Marseille",
    parts: [
      {
        id: "8",
        name: "Pneu hiver 205/55 R16",
        partNumber: "TW001",
        quantity: 4,
        unitPrice: 95.0,
        supplier: "Michelin",
      },
      {
        id: "9",
        name: "Équilibrage",
        partNumber: "BAL001",
        quantity: 4,
        unitPrice: 8.5,
        supplier: "Service",
      },
    ],
    laborHours: 2.0,
    priority: "medium",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
];

const MaintenanceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        // En production, remplacer par : const response = await maintenanceService.getById(id);
        const foundMaintenance = mockMaintenances.find((m) => m.id === id);

        if (!foundMaintenance) {
          setError("Maintenance non trouvée");
          return;
        }

        setMaintenance(foundMaintenance);
      } catch (error) {
        console.error("Erreur lors du chargement de la maintenance:", error);
        setError("Erreur lors du chargement de la maintenance");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaintenance();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/maintenance/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?")
    ) {
      try {
        // await maintenanceService.delete(id);
        navigate("/maintenance");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleMarkCompleted = async () => {
    if (window.confirm("Marquer cette maintenance comme terminée ?")) {
      try {
        const completedDate = new Date().toISOString().split("T")[0];
        // await maintenanceService.markCompleted(id, completedDate);
        if (maintenance) {
          setMaintenance({
            ...maintenance,
            status: "completed",
            completedDate,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !maintenance) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Maintenance non trouvée"}
            </h2>
            <p className="text-gray-500 mb-6">
              La maintenance que vous recherchez n'existe pas ou a été
              supprimée.
            </p>
            <button
              onClick={() => navigate("/maintenance")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MaintenanceDetails
      maintenance={maintenance}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onMarkCompleted={handleMarkCompleted}
    />
  );
};

export default MaintenanceDetailsPage;
