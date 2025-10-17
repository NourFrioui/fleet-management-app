import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Tag,
  Edit,
  Trash2,
  ArrowLeft,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { Extra } from "../types";

const ExtrasDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [extra, setExtra] = useState<Extra | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    // TODO: Remplacer par un appel API réel
    const fetchExtra = async () => {
      setIsLoading(true);
      try {
        // Données mockées
        const mockExtra: Extra = {
          id: id || "1",
          name: "Parking Centre-Ville Tunis",
          category: "Parking",
          price: 15,
          description:
            "Tarif journalier pour parking centre-ville. Parking sécurisé avec surveillance 24h/24. Accès facile aux bureaux du centre des affaires.",
          unit: "par jour",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Simuler un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 500));

        setExtra(mockExtra);
      } catch (error) {
        console.error("Erreur lors du chargement de l'extra:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtra();
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet extra ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      // TODO: Remplacer par un appel API réel
      console.log("Suppression de l'extra:", id);

      // Simuler un délai de suppression
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Rediriger vers la liste
      navigate("/settings/extras");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!extra) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Extra non trouvé
            </h2>
            <p className="mt-2 text-gray-600">
              L'extra que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              to="/settings/extras"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <Link
            to="/settings/extras"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste des extras
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Tag className="mr-3 h-8 w-8 text-blue-600" />
                {extra.name}
              </h1>
              <div className="mt-2 flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {extra.category}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    extra.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {extra.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/settings/extras/${extra.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-5 w-5" />
                Modifier
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-6">
            {/* Informations principales */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations générales
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nom
                  </label>
                  <p className="mt-1 text-base text-gray-900">{extra.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Catégorie
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {extra.category}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {extra.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Prix */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Prix</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {extra.price.toFixed(2)} TND
                  </p>
                </div>
              </div>
              {extra.unit && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Unité:</span> {extra.unit}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                Dates
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Créé le</p>
                  <p className="text-sm text-gray-900">
                    {new Date(extra.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dernière modification</p>
                  <p className="text-sm text-gray-900">
                    {new Date(extra.updatedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Statut
              </h3>
              <div
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  extra.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {extra.isActive ? "✓ Actif" : "✗ Inactif"}
              </div>
            </div>
          </div>
        </div>

        {/* Section d'utilisation (optionnel - pour montrer où cet extra est utilisé) */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Utilisation récente
          </h2>
          <p className="text-sm text-gray-500">
            Cette section affichera les véhicules ou transactions où cet extra a
            été utilisé.
          </p>
          {/* TODO: Ajouter une liste des utilisations récentes */}
        </div>
      </div>
    </div>
  );
};

export default ExtrasDetails;
