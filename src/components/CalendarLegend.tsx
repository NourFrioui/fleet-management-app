import React from "react";

const CalendarLegend: React.FC = () => {
  const legendItems = [
    { color: "bg-yellow-500", label: "Maintenance" },
    { color: "bg-red-500", label: "Carburant" },
    { color: "bg-blue-500", label: "Inspection" },
    { color: "bg-green-500", label: "Assurance" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Légende</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center">
            <div className={`w-4 h-4 ${item.color} rounded mr-2`}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
