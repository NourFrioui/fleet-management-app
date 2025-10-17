import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import type { Extra } from "../types";

// Données mockées avec différentes catégories
const mockExtras: Extra[] = [
  {
    id: "1",
    name: "Parking Centre-Ville Tunis",
    category: "Parking",
    price: 15,
    description: "Tarif journalier pour parking centre-ville",
    unit: "par jour",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  {
    id: "3",
    name: "Péage Autoroute Tunis-Sfax",
    category: "Péage",
    price: 8.5,
    description: "Tarif péage autoroute",
    unit: "par passage",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Gardiennage Mensuel",
    category: "Gardiennage",
    price: 200,
    description: "Service de gardiennage pour véhicules",
    unit: "par mois",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Remorquage Dépannage",
    category: "Dépannage",
    price: 80,
    description: "Service de remorquage en cas de panne",
    unit: "par intervention",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ExtrasSettings: React.FC = () => {
  const [extras, setExtras] = useState<Extra[]>(mockExtras);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Obtenir toutes les catégories uniques
  const categories = Array.from(new Set(extras.map((extra) => extra.category)));

  // Filtrer les extras
  const filteredExtras = extras.filter((extra) => {
    const matchesSearch =
      extra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extra.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extra.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || extra.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && extra.isActive) ||
      (statusFilter === "inactive" && !extra.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: extras.length,
    active: extras.filter((e) => e.isActive).length,
    categories: categories.length,
    avgPrice:
      extras.length > 0
        ? extras.reduce((sum, e) => sum + e.price, 0) / extras.length
        : 0,
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet extra ? Cette action est irréversible."
      )
    ) {
      setExtras(extras.filter((extra) => extra.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setExtras(
      extras.map((extra) =>
        extra.id === id ? { ...extra, isActive: !extra.isActive } : extra
      )
    );
  };

  // Grouper par catégorie pour l'affichage
  const extrasByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredExtras.filter((e) => e.category === category);
    return acc;
  }, {} as Record<string, Extra[]>);

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Tag className="mr-3 h-8 w-8 text-blue-600" />
              Gestion des Extras
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez tous vos tarifs supplémentaires : parking, péage, et
              plus
            </p>
          </div>
          <Link
            to="/settings/extras/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvel Extra
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Extras</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.categories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Prix Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgPrice.toFixed(2)} TND
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Rechercher un extra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des extras */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unité
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
            {filteredExtras.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Tag className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Aucun extra trouvé
                  </p>
                  <Link
                    to="/settings/extras/new"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Créer votre premier extra
                  </Link>
                </td>
              </tr>
            ) : (
              filteredExtras.map((extra) => (
                <tr key={extra.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-blue-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {extra.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {extra.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {extra.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {extra.price.toFixed(2)} TND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {extra.unit || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(extra.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        extra.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {extra.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/settings/extras/${extra.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/settings/extras/${extra.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(extra.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Affichage groupé par catégorie (optionnel) */}
      {categoryFilter === "all" && filteredExtras.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vue par catégorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryExtras = extrasByCategory[category];
              if (categoryExtras.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag className="h-5 w-5 text-blue-600 mr-2" />
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryExtras.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">{extra.name}</span>
                        <span className="font-medium text-gray-900">
                          {extra.price.toFixed(2)} TND
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtrasSettings;
