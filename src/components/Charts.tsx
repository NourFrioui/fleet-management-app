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
              formatter={(value: number, name: string) => [
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
              formatter={(value: number, name: string) => [
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

  const totalVehicles = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Répartition par type
        </h3>
        <div className="text-sm text-gray-500">
          Total: {totalVehicles} véhicules
        </div>
      </div>
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
              formatter={(value: number) => [
                `${value} véhicules (${((value / totalVehicles) * 100).toFixed(
                  1
                )}%)`,
                "Quantité",
              ]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
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
    { status: "Actifs", value: 4, color: "#10b981", percentage: 66.7 },
    { status: "Maintenance", value: 1, color: "#f59e0b", percentage: 16.7 },
    { status: "Inactifs", value: 1, color: "#ef4444", percentage: 16.7 },
  ];

  const totalVehicles = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Statut des véhicules
        </h3>
        <div className="text-sm text-gray-500">
          Total: {totalVehicles} véhicules
        </div>
      </div>

      {/* Graphique en barres horizontales */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              dataKey="status"
              type="category"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} véhicules`, "Quantité"]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende détaillée */}
      <div className="grid grid-cols-1 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.status}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {item.value} véhicules
              </div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
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
              formatter={(value: number, name: string) => [
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
              formatter={(value: number, name: string) => [
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
    {
      type: "Maintenances à venir",
      count: 4,
      color: "#f59e0b",
      priority: "Moyenne",
    },
    {
      type: "Assurances expirant",
      count: 2,
      color: "#ef4444",
      priority: "Haute",
    },
    {
      type: "Permis expirant",
      count: 1,
      color: "#f59e0b",
      priority: "Moyenne",
    },
    {
      type: "Véhicules en panne",
      count: 0,
      color: "#ef4444",
      priority: "Critique",
    },
  ];

  const totalAlerts = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertes actives</h3>
        <div className="text-sm text-gray-500">
          Total: {totalAlerts} alertes
        </div>
      </div>

      {/* Graphique en barres horizontales */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              dataKey="type"
              type="category"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} alertes`, "Quantité"]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende détaillée avec priorités */}
      <div className="grid grid-cols-1 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {item.type}
                </span>
                <div className="text-xs text-gray-500">
                  Priorité: {item.priority}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {item.count} alertes
              </div>
              {item.count > 0 && (
                <div className="text-xs text-gray-500">Action requise</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Résumé des alertes critiques */}
      {totalAlerts > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-red-800">
              {totalAlerts} alerte(s) nécessitant une attention immédiate
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Graphique en camembert pour le statut des véhicules
export const VehicleStatusPieChart: React.FC<ChartProps> = ({
  className = "",
}) => {
  const data = [
    { name: "Actifs", value: 4, color: "#10b981" },
    { name: "Maintenance", value: 1, color: "#f59e0b" },
    { name: "Inactifs", value: 1, color: "#ef4444" },
  ];

  const totalVehicles = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Statut des véhicules
        </h3>
        <div className="text-sm text-gray-500">
          Total: {totalVehicles} véhicules
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value} véhicules (${((value / totalVehicles) * 100).toFixed(
                  1
                )}%)`,
                "Quantité",
              ]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques détaillées */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="text-xs font-medium text-gray-700">{item.name}</div>
            <div className="text-sm font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500">
              {((item.value / totalVehicles) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
