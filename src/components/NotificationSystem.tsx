import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Shield,
  Fuel,
  Wrench,
} from "lucide-react";
import { mockVehicles, mockDrivers, mockMaintenances } from "../data/mockData";

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  category: "maintenance" | "insurance" | "license" | "fuel" | "general";
  read: boolean;
  actionUrl?: string;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = () => {
    const newNotifications: Notification[] = [];

    // Vérifier les maintenances à venir
    mockMaintenances.forEach((maintenance) => {
      const scheduledDate = new Date(maintenance.scheduledDate);
      const now = new Date();
      const diffDays = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (
        diffDays <= 7 &&
        diffDays >= 0 &&
        maintenance.status === "scheduled"
      ) {
        const vehicle = mockVehicles.find(
          (v) => v.id === maintenance.vehicleId
        );
        newNotifications.push({
          id: `maintenance-${maintenance.id}`,
          type: "warning",
          title: "Maintenance à venir",
          message: `Maintenance prévue pour ${
            vehicle?.plateNumber || "véhicule inconnu"
          } dans ${diffDays} jour(s)`,
          timestamp: new Date(),
          category: "maintenance",
          read: false,
          actionUrl: `/maintenance/${maintenance.id}`,
        });
      }
    });

    // Vérifier les permis de conduire expirant
    mockDrivers.forEach((driver) => {
      const expiryDate = new Date(driver.licenseExpiryDate);
      const now = new Date();
      const diffDays = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 30 && diffDays >= 0) {
        newNotifications.push({
          id: `license-${driver.id}`,
          type: diffDays <= 7 ? "error" : "warning",
          title: "Permis expirant",
          message: `Le permis de ${driver.name} expire dans ${diffDays} jour(s)`,
          timestamp: new Date(),
          category: "license",
          read: false,
          actionUrl: `/drivers/${driver.id}`,
        });
      }
    });

    // Vérifier les véhicules en maintenance
    mockVehicles.forEach((vehicle) => {
      if (vehicle.status === "maintenance") {
        newNotifications.push({
          id: `vehicle-maintenance-${vehicle.id}`,
          type: "info",
          title: "Véhicule en maintenance",
          message: `${vehicle.plateNumber} est actuellement en maintenance`,
          timestamp: new Date(),
          category: "maintenance",
          read: false,
          actionUrl: `/vehicles/${vehicle.id}`,
        });
      }
    });

    // Notifications d'exemple pour les assurances (simulées)
    newNotifications.push({
      id: "insurance-expiry-1",
      type: "warning",
      title: "Assurance expirant",
      message: "L'assurance du véhicule AB-123-CD expire dans 15 jours",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
      category: "insurance",
      read: false,
      actionUrl: "/insurance",
    });

    // Trier par timestamp (plus récent en premier)
    newNotifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter((n) => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (category: string, type: string) => {
    switch (category) {
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "insurance":
        return <Shield className="h-4 w-4" />;
      case "license":
        return <Calendar className="h-4 w-4" />;
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      default:
        return type === "error" ? (
          <XCircle className="h-4 w-4" />
        ) : type === "warning" ? (
          <AlertTriangle className="h-4 w-4" />
        ) : type === "success" ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        );
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour(s)`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des notifications */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50/30" : ""
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(
                          notification.category,
                          notification.type
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
