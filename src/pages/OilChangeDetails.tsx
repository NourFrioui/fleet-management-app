import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OilChangeDetails from "../components/OilChangeDetails";
import type { OilChange } from "../types";
import { mockOilChanges } from "../data/mockData";

const OilChangeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [oilChange, setOilChange] = useState<OilChange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOilChange = async () => {
      try {
        setLoading(true);
        // En production, remplacer par : const response = await oilChangeService.getById(id);
        const foundOilChange = mockOilChanges.find((oc) => oc.id === id);

        if (!foundOilChange) {
          setError("Vidange non trouvée");
          return;
        }

        setOilChange(foundOilChange);
      } catch (error) {
        console.error("Erreur lors du chargement de la vidange:", error);
        setError("Erreur lors du chargement de la vidange");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOilChange();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/oil-change/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vidange ?")) {
      try {
        // await oilChangeService.delete(id);
        navigate("/oil-change");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleMarkCompleted = async () => {
    if (window.confirm("Marquer cette vidange comme terminée ?")) {
      try {
        const completedDate = new Date().toISOString().split("T")[0];
        // await oilChangeService.markCompleted(id, completedDate);
        if (oilChange) {
          setOilChange({
            ...oilChange,
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

  if (error || !oilChange) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Vidange non trouvée"}
            </h2>
            <p className="text-gray-500 mb-6">
              La vidange que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <button
              onClick={() => navigate("/oil-change")}
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
    <OilChangeDetails
      oilChange={oilChange}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onMarkCompleted={handleMarkCompleted}
    />
  );
};

export default OilChangeDetailsPage;
