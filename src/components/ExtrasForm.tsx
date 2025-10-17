import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tag, Save, X, Plus } from "lucide-react";
import type { ExtraFormData } from "../types";

interface ExtrasFormProps {
  isEdit?: boolean;
}

const ExtrasForm: React.FC<ExtrasFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catégories prédéfinies (modifiables)
  const predefinedCategories = [
    "Parking",
    "Péage",
    "Gardiennage",
    "Dépannage",
    "Assurance Supplémentaire",
    "Équipement",
    "Formation",
    "Location",
    "Autre",
  ];

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState<ExtraFormData>({
    name: "",
    category: "",
    price: 0,
    description: "",
    unit: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ExtraFormData, string>>
  >({});

  useEffect(() => {
    if (isEdit && id) {
      // Simuler le chargement des données en mode édition
      // TODO: Remplacer par un appel API réel
      const mockData: ExtraFormData = {
        name: "Parking Centre-Ville Tunis",
        category: "Parking",
        price: 15,
        description: "Tarif journalier pour parking centre-ville",
        unit: "par jour",
        isActive: true,
      };
      setFormData(mockData);
    }
  }, [isEdit, id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExtraFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.category.trim()) {
      newErrors.category = "La catégorie est requise";
    }

    if (formData.price <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Remplacer par un appel API réel
      console.log("Données du formulaire:", formData);

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Rediriger vers la liste des extras
      navigate("/settings/extras");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof ExtraFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Tag className="mr-3 h-8 w-8 text-blue-600" />
            {isEdit ? "Modifier l'Extra" : "Nouvel Extra"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? "Modifiez les informations de cet extra"
              : "Ajoutez un nouveau tarif supplémentaire"}
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="space-y-6">
            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom de l'extra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ex: Parking Centre-Ville, Lavage Premium..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Catégorie <span className="text-red-500">*</span>
              </label>
              {!showCustomCategory ? (
                <div className="mt-1 flex gap-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Nouvelle catégorie..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Prix et Unité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prix (TND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unité
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une unité</option>
                  <option value="par heure">par heure</option>
                  <option value="par jour">par jour</option>
                  <option value="par semaine">par semaine</option>
                  <option value="par mois">par mois</option>
                  <option value="par unité">par unité</option>
                  <option value="par véhicule">par véhicule</option>
                  <option value="par intervention">par intervention</option>
                  <option value="par passage">par passage</option>
                  <option value="par kilomètre">par kilomètre</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Décrivez les détails de cet extra..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Statut */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Extra actif
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-6 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/settings/extras")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="mr-2 h-5 w-5" />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting
                ? "Enregistrement..."
                : isEdit
                ? "Mettre à jour"
                : "Créer l'extra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtrasForm;
