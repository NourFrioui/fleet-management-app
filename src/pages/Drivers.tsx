import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import type { Driver } from "../types";
import { mockDrivers } from "../data/mockData";

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // En production, remplacer par : const response = await driverService.getAll();
        setDrivers(mockDrivers);
      } catch (error) {
        console.error("Erreur lors du chargement des chauffeurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "suspended":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "inactive":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "suspended":
        return "Suspendu";
      case "inactive":
        return "Inactif";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {
      try {
        // await driverService.delete(id);
        setDrivers(drivers.filter((d) => d.id !== id));
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chauffeurs</h1>
          <p className="mt-2 text-gray-600">
            Gestion des chauffeurs de votre flotte
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/drivers/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un chauffeur
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="card card-hover p-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Rechercher un chauffeur
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="input-field pl-12"
              placeholder="Nom, email, numéro de permis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Liste des chauffeurs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDrivers.map((driver) => (
            <li key={driver.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-600 p-2 rounded-full">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {driver.name}
                        </p>
                        <div className="ml-2 flex items-center">
                          {getStatusIcon(driver.status)}
                        </div>
                        {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                          <div className="ml-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{driver.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{driver.phone}</span>
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>Permis: {driver.licenseNumber}</span>
                        <span className="mx-2">•</span>
                        <span>
                          Expire:{" "}
                          {new Date(
                            driver.licenseExpiryDate
                          ).toLocaleDateString()}
                        </span>
                        {driver.assignedVehicleId && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Véhicule assigné</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        driver.status
                      )}`}
                    >
                      {getStatusText(driver.status)}
                    </span>
                    <Link
                      to={`/drivers/${driver.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/drivers/${driver.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Embauché le{" "}
                      {new Date(driver.hireDate).toLocaleDateString()}
                    </span>
                  </div>
                  {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                    <div className="text-red-600 font-medium">
                      Permis expire bientôt !
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun chauffeur trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter un nouveau chauffeur."}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  to="/drivers/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un chauffeur
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
