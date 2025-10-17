import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationSystem from "./NotificationSystem";
import {
  LayoutDashboard,
  Truck,
  Users,
  Calendar,
  Wrench,
  Fuel,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  Droplets,
  ClipboardCheck,
  Disc,
  Sparkles,
  Bell,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Véhicules", href: "/vehicles", icon: Truck },
    { name: "Chauffeurs", href: "/drivers", icon: Users },
    { name: "Calendrier", href: "/calendar", icon: Calendar },
    {
      name: "Maintenance",
      icon: Wrench,
      hasSubmenu: true,
      subItems: [
        {
          name: "Maintenance Générale",
          href: "/maintenance",
          icon: Wrench,
        },
        {
          name: "Vidange",
          href: "/oil-change",
          icon: Droplets,
        },
        {
          name: "Visite Technique",
          href: "/technical-inspection",
          icon: ClipboardCheck,
        },
        {
          name: "Changement de Pneus",
          href: "/tire-change",
          icon: Disc,
        },
        {
          name: "Lavage",
          href: "/washing",
          icon: Sparkles,
        },
      ],
    },
    { name: "Carburant", href: "/fuel", icon: Fuel },
    { name: "Assurances", href: "/insurance", icon: Shield },
    { name: "Alertes & Rappels", href: "/alerts", icon: Bell },
  ];

  const isCurrentPath = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isMaintenanceActive = () => {
    return (
      location.pathname.startsWith("/maintenance") ||
      location.pathname.startsWith("/oil-change") ||
      location.pathname.startsWith("/technical-inspection") ||
      location.pathname.startsWith("/tire-change") ||
      location.pathname.startsWith("/washing")
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar mobile */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Fleet Manager
              </span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                if (item.hasSubmenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setMaintenanceOpen(!maintenanceOpen)}
                        className={`${
                          isMaintenanceActive()
                            ? "bg-primary-100 text-primary-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        } w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md`}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-4 h-6 w-6" />
                          {item.name}
                        </div>
                        {maintenanceOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {maintenanceOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`${
                                  isCurrentPath(subItem.href)
                                    ? "bg-primary-50 text-primary-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <SubIcon className="mr-3 h-5 w-5" />
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={`${
                      isCurrentPath(item.href!)
                        ? "bg-primary-100 text-primary-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 sidebar">
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-8 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-gray-900">
                    Fleet Manager
                  </span>
                  <p className="text-xs text-gray-500">Système de gestion</p>
                </div>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  if (item.hasSubmenu) {
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => setMaintenanceOpen(!maintenanceOpen)}
                          className={`${
                            isMaintenanceActive()
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                              : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-700"
                          } w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300`}
                        >
                          <div className="flex items-center">
                            <Icon
                              className={`mr-3 h-5 w-5 transition-colors ${
                                isMaintenanceActive()
                                  ? "text-white"
                                  : "text-gray-500 group-hover:text-blue-600"
                              }`}
                            />
                            {item.name}
                          </div>
                          {maintenanceOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {maintenanceOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.subItems?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`${
                                    isCurrentPath(subItem.href)
                                      ? "bg-blue-100 text-blue-900 font-medium"
                                      : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-700"
                                  } group flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-300`}
                                >
                                  <SubIcon
                                    className={`mr-3 h-4 w-4 transition-colors ${
                                      isCurrentPath(subItem.href)
                                        ? "text-blue-700"
                                        : "text-gray-400 group-hover:text-blue-600"
                                    }`}
                                  />
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      to={item.href!}
                      className={`${
                        isCurrentPath(item.href!)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                          : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-700"
                      } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 transition-colors ${
                          isCurrentPath(item.href!)
                            ? "text-white"
                            : "text-gray-500 group-hover:text-blue-600"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-20 glass-effect border-b border-gray-200/50">
          <button
            type="button"
            className="px-6 border-r border-gray-200/50 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-8 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Bienvenue, {user?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Gérez votre flotte de véhicules efficacement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              {/* Système de notifications */}
              <NotificationSystem />

              {/* Menu utilisateur */}
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-semibold text-white">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100">
          <div className="p-8">
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
