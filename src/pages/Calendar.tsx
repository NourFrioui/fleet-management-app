import React, { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { CalendarEvent } from "../types";
import { mockCalendarEvents } from "../data/mockData";

// Configuration de moment pour le français
moment.locale("fr");

const localizer = momentLocalizer(moment);

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        // En production, remplacer par : const response = await dashboardService.getCalendarEvents(startDate, endDate);
        setEvents(mockCalendarEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad";

    switch (event.type) {
      case "maintenance":
        backgroundColor = "#f59e0b";
        break;
      case "fuel":
        backgroundColor = "#ef4444";
        break;
      case "inspection":
        backgroundColor = "#3b82f6";
        break;
      case "insurance":
        backgroundColor = "#10b981";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    alert(
      `Événement: ${event.title}\nDescription: ${
        event.description || "Aucune description"
      }`
    );
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("Nouvel événement:");
    if (title) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title,
        start,
        end,
        type: "maintenance",
        vehicleId: "",
        status: "scheduled",
      };
      setEvents([...events, newEvent]);
    }
  };

  const messages = {
    allDay: "Toute la journée",
    previous: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Événement",
    noEventsInRange: "Aucun événement dans cette période",
    showMore: (total: number) => `+${total} événements`,
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
        <p className="mt-1 text-sm text-gray-500">
          Planification et suivi des maintenances et événements
        </p>
      </div>

      {/* Légende */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Légende</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Carburant</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Inspection</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Assurance</span>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-[600px]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            messages={messages}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            step={30}
            timeslots={2}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Comment utiliser le calendrier
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Cliquez sur un événement pour voir les détails</li>
                <li>
                  Cliquez sur un créneau vide pour ajouter un nouvel événement
                </li>
                <li>
                  Utilisez les boutons en haut pour naviguer et changer de vue
                </li>
                <li>Les couleurs indiquent le type d'événement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
