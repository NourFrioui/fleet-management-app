import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  User,
  Truck,
  Wrench,
  Shield,
  Fuel,
} from "lucide-react";

interface SearchFilter {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "range";
  options?: { value: string; label: string }[];
  value?: string | number;
  placeholder?: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: Record<string, string | number>) => void;
  onClear: () => void;
  searchType: "vehicles" | "drivers" | "maintenance" | "fuel" | "insurance";
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  searchType,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const getFiltersForType = (type: string): SearchFilter[] => {
    switch (type) {
      case "vehicles":
        return [
          {
            id: "plateNumber",
            label: "Numéro d'immatriculation",
            type: "text",
            placeholder: "Ex: AB-123-CD",
          },
          {
            id: "brand",
            label: "Marque",
            type: "text",
            placeholder: "Ex: Mercedes",
          },
          {
            id: "type",
            label: "Type de véhicule",
            type: "select",
            options: [
              { value: "truck", label: "Camion" },
              { value: "car", label: "Voiture" },
              { value: "van", label: "Van" },
              { value: "motorcycle", label: "Moto" },
              { value: "bus", label: "Bus" },
              { value: "trailer", label: "Remorque" },
            ],
          },
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Actif" },
              { value: "maintenance", label: "Maintenance" },
              { value: "inactive", label: "Inactif" },
            ],
          },
          {
            id: "fuelType",
            label: "Type de carburant",
            type: "select",
            options: [
              { value: "gasoline", label: "Essence" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Électrique" },
              { value: "hybrid", label: "Hybride" },
              { value: "lpg", label: "GPL" },
            ],
          },
          {
            id: "yearRange",
            label: "Année",
            type: "range",
          },
          {
            id: "mileageRange",
            label: "Kilométrage",
            type: "range",
          },
        ];

      case "drivers":
        return [
          {
            id: "name",
            label: "Nom",
            type: "text",
            placeholder: "Ex: Jean Dupont",
          },
          {
            id: "email",
            label: "Email",
            type: "text",
            placeholder: "Ex: jean@example.com",
          },
          {
            id: "licenseNumber",
            label: "Numéro de permis",
            type: "text",
            placeholder: "Ex: DL123456789",
          },
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Actif" },
              { value: "suspended", label: "Suspendu" },
              { value: "inactive", label: "Inactif" },
            ],
          },
          {
            id: "licenseExpiry",
            label: "Expiration du permis",
            type: "date",
          },
          {
            id: "hireDate",
            label: "Date d'embauche",
            type: "date",
          },
        ];

      case "maintenance":
        return [
          {
            id: "vehicleId",
            label: "Véhicule",
            type: "select",
            options: [], // Sera rempli dynamiquement
          },
          {
            id: "type",
            label: "Type de maintenance",
            type: "select",
            options: [
              { value: "routine", label: "Routine" },
              { value: "repair", label: "Réparation" },
              { value: "inspection", label: "Inspection" },
              { value: "oil_change", label: "Vidange" },
              { value: "tire_change", label: "Changement de pneus" },
              { value: "brake_service", label: "Service de freinage" },
              { value: "engine_service", label: "Service moteur" },
            ],
          },
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "scheduled", label: "Programmée" },
              { value: "in_progress", label: "En cours" },
              { value: "completed", label: "Terminée" },
              { value: "cancelled", label: "Annulée" },
            ],
          },
          {
            id: "dateRange",
            label: "Période",
            type: "date",
          },
          {
            id: "costRange",
            label: "Coût",
            type: "range",
          },
          {
            id: "technician",
            label: "Technicien",
            type: "text",
            placeholder: "Ex: Garage Central",
          },
        ];

      case "fuel":
        return [
          {
            id: "vehicleId",
            label: "Véhicule",
            type: "select",
            options: [], // Sera rempli dynamiquement
          },
          {
            id: "fuelType",
            label: "Type de carburant",
            type: "select",
            options: [
              { value: "gasoline", label: "Essence" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Électrique" },
            ],
          },
          {
            id: "dateRange",
            label: "Période",
            type: "date",
          },
          {
            id: "quantityRange",
            label: "Quantité (litres)",
            type: "range",
          },
          {
            id: "costRange",
            label: "Coût (€)",
            type: "range",
          },
          {
            id: "station",
            label: "Station-service",
            type: "text",
            placeholder: "Ex: Station Total",
          },
        ];

      case "insurance":
        return [
          {
            id: "vehicleId",
            label: "Véhicule",
            type: "select",
            options: [], // Sera rempli dynamiquement
          },
          {
            id: "type",
            label: "Type d'assurance",
            type: "select",
            options: [
              { value: "comprehensive", label: "Tous risques" },
              { value: "third_party", label: "Au tiers" },
              { value: "fire_theft", label: "Vol et incendie" },
              { value: "commercial", label: "Commerciale" },
            ],
          },
          {
            id: "company",
            label: "Compagnie",
            type: "text",
            placeholder: "Ex: AXA",
          },
          {
            id: "status",
            label: "Statut",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "expired", label: "Expirée" },
              { value: "cancelled", label: "Annulée" },
            ],
          },
          {
            id: "expiryDate",
            label: "Date d'expiration",
            type: "date",
          },
          {
            id: "premiumRange",
            label: "Prime annuelle (€)",
            type: "range",
          },
        ];

      default:
        return [];
    }
  };

  const searchFilters = getFiltersForType(searchType);

  const handleFilterChange = (filterId: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const handleSearch = () => {
    const searchParams = {
      search: searchTerm,
      ...filters,
    };
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilters({});
    onClear();
  };

  const getActiveFiltersCount = () => {
    const filterCount = Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length;
    return searchTerm ? filterCount + 1 : filterCount;
  };

  const renderFilterInput = (filter: SearchFilter) => {
    switch (filter.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={filter.placeholder}
            value={filters[filter.id] || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        );

      case "select":
        return (
          <select
            value={filters[filter.id] || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Tous</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="Date de début"
              value={filters[`${filter.id}_start`] || ""}
              onChange={(e) =>
                handleFilterChange(`${filter.id}_start`, e.target.value)
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="date"
              placeholder="Date de fin"
              value={filters[`${filter.id}_end`] || ""}
              onChange={(e) =>
                handleFilterChange(`${filter.id}_end`, e.target.value)
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        );

      case "range":
        return (
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters[`${filter.id}_min`] || ""}
              onChange={(e) =>
                handleFilterChange(
                  `${filter.id}_min`,
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters[`${filter.id}_max`] || ""}
              onChange={(e) =>
                handleFilterChange(
                  `${filter.id}_max`,
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getSearchIcon = () => {
    switch (searchType) {
      case "vehicles":
        return <Truck className="h-4 w-4" />;
      case "drivers":
        return <User className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      case "insurance":
        return <Shield className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Barre de recherche principale */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Rechercher ${
                  searchType === "vehicles"
                    ? "des véhicules"
                    : searchType === "drivers"
                    ? "des chauffeurs"
                    : searchType === "maintenance"
                    ? "des maintenances"
                    : searchType === "fuel"
                    ? "du carburant"
                    : searchType === "insurance"
                    ? "des assurances"
                    : ""
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                getActiveFiltersCount() > 0 ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getActiveFiltersCount()}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {getSearchIcon()}
              <span className="ml-2">Rechercher</span>
            </button>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={handleClear}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchFilters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>

          {/* Actions des filtres */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Fermer
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <X className="h-4 w-4 mr-2" />
              Effacer tout
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Search className="h-4 w-4 mr-2" />
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
