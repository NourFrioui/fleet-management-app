import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { Driver } from "../types";
import { mockDrivers } from "../data/mockData";

const DriversModern: React.FC = () => {
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
        return <XCircle className="h-5 w-5 text-yellow-500" />;
      case "inactive":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const handleDelete = (driverId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {
      setDrivers(drivers.filter((driver) => driver.id !== driverId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card card-hover p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter((d) => d.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Suspendus</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter((d) => d.status === "suspended").length}
              </p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Permis expirent
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  drivers.filter((d) =>
                    isLicenseExpiringSoon(d.licenseExpiryDate)
                  ).length
                }
              </p>
            </div>
          </div>
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
      <div className="space-y-4">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="card card-hover p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-lg font-semibold text-gray-900">
                      {driver.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(driver.status)}
                      {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {driver.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {driver.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Permis: {driver.licenseNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Expire:{" "}
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Embauché le {new Date(driver.hireDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`status-badge ${
                    driver.status === "active"
                      ? "bg-green-100 text-green-800"
                      : driver.status === "suspended"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {driver.status === "active"
                    ? "Actif"
                    : driver.status === "suspended"
                    ? "Suspendu"
                    : "Inactif"}
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/drivers/${driver.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/drivers/${driver.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(driver.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Permis expire bientôt !
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversModern;
