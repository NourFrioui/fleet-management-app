import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TechnicalInspectionDetails from "../components/TechnicalInspectionDetails";
import type { TechnicalInspection } from "../types";
import { mockTechnicalInspections } from "../data/mockData";

const TechnicalInspectionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<TechnicalInspection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setLoading(true);
        // En production, remplacer par : const response = await technicalInspectionService.getById(id);
        const foundInspection = mockTechnicalInspections.find(
          (i) => i.id === id
        );

        if (!foundInspection) {
          setError("Visite technique non trouvée");
          return;
        }

        setInspection(foundInspection);
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la visite technique:",
          error
        );
        setError("Erreur lors du chargement de la visite technique");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInspection();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/technical-inspection/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette visite technique ?"
      )
    ) {
      try {
        // await technicalInspectionService.delete(id);
        navigate("/technical-inspection");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
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

  if (error || !inspection) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Visite technique non trouvée"}
            </h2>
            <p className="text-gray-500 mb-6">
              La visite technique que vous recherchez n'existe pas ou a été
              supprimée.
            </p>
            <button
              onClick={() => navigate("/technical-inspection")}
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
    <TechnicalInspectionDetails
      inspection={inspection}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default TechnicalInspectionDetailsPage;
