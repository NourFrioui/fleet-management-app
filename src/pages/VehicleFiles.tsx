import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Image,
  Upload,
  Download,
  Trash2,
  Plus,
  ArrowLeft,
  File,
  FileCheck,
  X,
} from "lucide-react";
import type { FileAttachment, Vehicle } from "../types";

const VehicleFiles: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: "document",
    description: "",
    tags: "",
  });

  // Mock data
  const mockVehicle: Vehicle = {
    id: vehicleId || "1",
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
  };

  const mockFiles: FileAttachment[] = [
    {
      id: "1",
      vehicleId: vehicleId || "1",
      fileName: "Contrat_Achat_Vehicule.pdf",
      fileSize: 245678,
      fileType: "application/pdf",
      fileUrl: "/files/contrat_achat.pdf",
      category: "contract",
      description: "Contrat d'achat du véhicule signé",
      uploadedBy: "Admin",
      uploadDate: "2020-01-15",
      tags: ["achat", "contrat", "légal"],
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2020-01-15T00:00:00Z",
    },
    {
      id: "2",
      vehicleId: vehicleId || "1",
      fileName: "Assurance_2024.pdf",
      fileSize: 156789,
      fileType: "application/pdf",
      fileUrl: "/files/assurance_2024.pdf",
      category: "certificate",
      description: "Certificat d'assurance tous risques 2024",
      uploadedBy: "Admin",
      uploadDate: "2024-01-01",
      tags: ["assurance", "certificat"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      vehicleId: vehicleId || "1",
      fileName: "Photo_Carte_Grise.jpg",
      fileSize: 892345,
      fileType: "image/jpeg",
      fileUrl: "/files/carte_grise.jpg",
      category: "document",
      description: "Copie de la carte grise du véhicule",
      uploadedBy: "Admin",
      uploadDate: "2020-01-15",
      tags: ["carte grise", "document officiel"],
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2020-01-15T00:00:00Z",
    },
    {
      id: "4",
      vehicleId: vehicleId || "1",
      fileName: "Facture_Vidange_Mars_2024.pdf",
      fileSize: 89234,
      fileType: "application/pdf",
      fileUrl: "/files/facture_vidange.pdf",
      category: "invoice",
      description: "Facture de la vidange effectuée en mars 2024",
      uploadedBy: "Admin",
      uploadDate: "2024-03-15",
      tags: ["facture", "vidange", "maintenance"],
      createdAt: "2024-03-15T00:00:00Z",
      updatedAt: "2024-03-15T00:00:00Z",
    },
  ];

  const filteredFiles = mockFiles.filter((file) => {
    const matchesCategory =
      filterCategory === "" || file.category === filterCategory;
    return matchesCategory;
  });

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      document: "Document",
      image: "Image",
      contract: "Contrat",
      invoice: "Facture",
      report: "Rapport",
      certificate: "Certificat",
      other: "Autre",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      document: "bg-blue-100 text-blue-800",
      image: "bg-green-100 text-green-800",
      contract: "bg-purple-100 text-purple-800",
      invoice: "bg-yellow-100 text-yellow-800",
      report: "bg-indigo-100 text-indigo-800",
      certificate: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-8 w-8 text-green-600" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      setShowUploadModal(true);
      event.target.value = "";
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;

    try {
      console.log("Upload des fichiers avec métadonnées:", {
        files: selectedFiles,
        category: uploadData.category,
        description: uploadData.description,
        tags: uploadData.tags.split(",").map((t) => t.trim()),
      });

      // TODO: Implémenter l'appel API réel
      // const formData = new FormData();
      // selectedFiles.forEach((file) => formData.append("files", file));
      // formData.append("category", uploadData.category);
      // formData.append("description", uploadData.description);
      // formData.append("tags", uploadData.tags);
      // await api.uploadVehicleFiles(vehicleId, formData);

      // Simuler un délai d'upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`${selectedFiles.length} fichier(s) téléchargé(s) avec succès!`);

      // Reset
      setSelectedFiles([]);
      setUploadData({ category: "document", description: "", tags: "" });
      setShowUploadModal(false);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload. Veuillez réessayer.");
    }
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setUploadData({ category: "document", description: "", tags: "" });
    setShowUploadModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      console.log("Delete file:", id);
    }
  };

  const handleDownload = async (file: FileAttachment) => {
    try {
      // Méthode 1: Si le fichier est sur un serveur (URL réelle)
      // Créer un lien temporaire et déclencher le téléchargement
      const link = document.createElement("a");
      link.href = file.fileUrl;
      link.download = file.fileName;
      link.target = "_blank";

      // Ajouter au DOM, cliquer et retirer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Téléchargement du fichier:", file.fileName);

      // Si l'URL n'est pas accessible (fichier mock), afficher un message
      // Dans un environnement de production, vous feriez un appel API:
      // const response = await fetch(`/api/files/${file.id}/download`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // link.href = url;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("Erreur lors du téléchargement du fichier. Veuillez réessayer.");
    }
  };

  const totalSize = filteredFiles.reduce((sum, file) => sum + file.fileSize, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/vehicles/${vehicleId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fichiers du Véhicule
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {mockVehicle.brand} {mockVehicle.model} -{" "}
              {mockVehicle.plateNumber}
            </p>
          </div>
        </div>
        <label className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
          <Plus className="h-5 w-5 mr-2" />
          Ajouter des fichiers
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          />
        </label>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Fichiers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredFiles.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taille Totale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(totalSize)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  filteredFiles.filter((f) => f.fileType.startsWith("image/"))
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Image className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  filteredFiles.filter((f) => !f.fileType.startsWith("image/"))
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Télécharger des fichiers
                </h3>
                <button
                  onClick={handleCancelUpload}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Liste des fichiers sélectionnés */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Fichiers sélectionnés ({selectedFiles.length})
                </p>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <File className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire de métadonnées */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="contract">Contrat</option>
                    <option value="invoice">Facture</option>
                    <option value="report">Rapport</option>
                    <option value="certificate">Certificat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Description du fichier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={uploadData.tags}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, tags: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ex: assurance, 2024, important"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCancelUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUploadSubmit}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Télécharger ({selectedFiles.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Catégorie:
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="contract">Contrat</option>
            <option value="invoice">Facture</option>
            <option value="report">Rapport</option>
            <option value="certificate">Certificat</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      {/* Liste des fichiers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun fichier trouvé</p>
            <p className="text-sm text-gray-400 mt-2">
              Utilisez le bouton ci-dessus pour ajouter des fichiers
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {file.fileName}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            file.category
                          )}`}
                        >
                          {getCategoryLabel(file.category)}
                        </span>
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {file.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>•</span>
                        <span>
                          Ajouté le{" "}
                          {new Date(file.uploadDate).toLocaleDateString(
                            "fr-TN"
                          )}
                        </span>
                        {file.uploadedBy && (
                          <>
                            <span>•</span>
                            <span>Par {file.uploadedBy}</span>
                          </>
                        )}
                      </div>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {file.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleFiles;
