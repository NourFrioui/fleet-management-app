import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  className?: string;
}

// Graphique de consommation de carburant
export const FuelConsumptionChart: React.FC<ChartProps> = ({
  className = "",
}) => {
  const data = [
    { month: "Jan", consommation: 8.2, coût: 1250 },
    { month: "Fév", consommation: 8.5, coût: 1320 },
    { month: "Mar", consommation: 8.1, coût: 1280 },
    { month: "Avr", consommation: 7.9, coût: 1210 },
    { month: "Mai", consommation: 8.3, coût: 1350 },
    { month: "Jun", consommation: 8.0, coût: 1290 },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Évolution de la consommation
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                name === "consommation" ? `${value}L/100km` : `${value}TND`,
                name === "consommation" ? "Consommation" : "Coût",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="consommation"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Consommation"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique des coûts de maintenance
export const MaintenanceCostsChart: React.FC<ChartProps> = ({
  className = "",
}) => {
  const data = [
    { month: "Jan", coût: 3200, nombre: 12 },
    { month: "Fév", coût: 2800, nombre: 8 },
    { month: "Mar", coût: 4500, nombre: 15 },
    { month: "Avr", coût: 3100, nombre: 11 },
    { month: "Mai", coût: 3800, nombre: 13 },
    { month: "Jun", coût: 2900, nombre: 9 },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Coûts de maintenance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                name === "coût" ? `${value}TND` : `${value} interventions`,
                name === "coût" ? "Coût total" : "Nombre d'interventions",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="coût"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              name="Coût total"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique de répartition des véhicules par type
export const VehicleTypeChart: React.FC<ChartProps> = ({ className = "" }) => {
  const data = [
    { name: "Camions", value: 2, color: "#3b82f6" },
    { name: "Voitures", value: 2, color: "#10b981" },
    { name: "Vans", value: 2, color: "#f59e0b" },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Répartition par type
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${value} véhicules`, "Quantité"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique des statuts des véhicules
export const VehicleStatusChart: React.FC<ChartProps> = ({
  className = "",
}) => {
  const data = [
    { status: "Actifs", value: 4, color: "#10b981" },
    { status: "Maintenance", value: 1, color: "#f59e0b" },
    { status: "Inactifs", value: 1, color: "#ef4444" },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Statut des véhicules
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="status" type="category" width={80} />
            <Tooltip
              formatter={(value: any) => [`${value} véhicules`, "Quantité"]}
            />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique des coûts mensuels
export const MonthlyCostsChart: React.FC<ChartProps> = ({ className = "" }) => {
  const data = [
    {
      month: "Jan",
      carburant: 1250,
      maintenance: 3200,
      assurance: 800,
      total: 5250,
    },
    {
      month: "Fév",
      carburant: 1320,
      maintenance: 2800,
      assurance: 800,
      total: 4920,
    },
    {
      month: "Mar",
      carburant: 1280,
      maintenance: 4500,
      assurance: 800,
      total: 6580,
    },
    {
      month: "Avr",
      carburant: 1210,
      maintenance: 3100,
      assurance: 800,
      total: 5110,
    },
    {
      month: "Mai",
      carburant: 1350,
      maintenance: 3800,
      assurance: 800,
      total: 5950,
    },
    {
      month: "Jun",
      carburant: 1290,
      maintenance: 2900,
      assurance: 800,
      total: 4990,
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Coûts mensuels détaillés
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                `${value}TND`,
                name === "carburant"
                  ? "Carburant"
                  : name === "maintenance"
                  ? "Maintenance"
                  : name === "assurance"
                  ? "Assurance"
                  : name === "total"
                  ? "Total"
                  : name,
              ]}
            />
            <Legend />
            <Bar
              dataKey="carburant"
              stackId="a"
              fill="#3b82f6"
              name="Carburant"
            />
            <Bar
              dataKey="maintenance"
              stackId="a"
              fill="#10b981"
              name="Maintenance"
            />
            <Bar
              dataKey="assurance"
              stackId="a"
              fill="#f59e0b"
              name="Assurance"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique de performance des chauffeurs
export const DriverPerformanceChart: React.FC<ChartProps> = ({
  className = "",
}) => {
  const data = [
    { name: "Jean Dupont", kilomètres: 4500, consommation: 8.2, note: 4.5 },
    { name: "Marie Martin", kilomètres: 6200, consommation: 8.8, note: 4.2 },
    { name: "Pierre Durand", kilomètres: 3800, consommation: 7.9, note: 4.7 },
    { name: "Sophie Leroy", kilomètres: 5100, consommation: 8.1, note: 4.4 },
    { name: "Marc Dubois", kilomètres: 5800, consommation: 8.5, note: 4.3 },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance des chauffeurs
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                name === "kilomètres"
                  ? `${value.toLocaleString()} km`
                  : name === "consommation"
                  ? `${value}L/100km`
                  : name === "note"
                  ? `${value}/5`
                  : value,
                name === "kilomètres"
                  ? "Kilométrage"
                  : name === "consommation"
                  ? "Consommation"
                  : name === "note"
                  ? "Note"
                  : name,
              ]}
            />
            <Legend />
            <Bar dataKey="kilomètres" fill="#3b82f6" name="Kilométrage" />
            <Bar dataKey="consommation" fill="#10b981" name="Consommation" />
            <Bar dataKey="note" fill="#f59e0b" name="Note" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Graphique des alertes et notifications
export const AlertsChart: React.FC<ChartProps> = ({ className = "" }) => {
  const data = [
    { type: "Maintenances à venir", count: 4, color: "#f59e0b" },
    { type: "Assurances expirant", count: 2, color: "#ef4444" },
    { type: "Permis expirant", count: 1, color: "#f59e0b" },
    { type: "Véhicules en panne", count: 0, color: "#ef4444" },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Alertes actives
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={120} />
            <Tooltip
              formatter={(value: any) => [`${value} alertes`, "Quantité"]}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
